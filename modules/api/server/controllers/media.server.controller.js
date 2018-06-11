'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Media = mongoose.model('Media'),
	votes = require('./votes.server.controller'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	_ = require('lodash'),
	scrape = require('html-metadata');

/**
 * Create a media
 */
exports.create = function (req, res) {
	var media = new Media(req.body);
	media.user = req.user;
	media.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(media);
		}
	});
};

// exports.updateOrCreate = function (req, res) {
// 	var user = req.user;
// 	var object = req.body.object;
// 	Media.findOne({
// 		user: user,
// 		object: object
// 	}).exec(function (err, media) {
// 		if (err) {
// 			return res.status(400).send({
// 				message: errorHandler.getErrorMessage(err)
// 			});
// 		} else if (!media) {
// 			return exports.create(req, res);
// 		}
// 		req.media = media;
// 		return exports.update(req, res);
// 	});
// };

/**
 * Show the current media
 */
exports.read = function (req, res) {
	res.json(req.media);
};

/**
 * Update a media
 */
exports.update = function (req, res) {
	var media = req.media;
	_.extend(media, req.body);

	media.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(media);
		}
	});
};

/**
 * Delete an media
 */
exports.delete = function (req, res) {
	var media = req.media;

	media.remove(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(media);
		}
	});
};

/**
 * List of Medias
 */
exports.list = function (req, res) {
	var goalId = req.query.goalId,
		issueId = req.query.issueId,
		solutionId = req.query.solutionId,
		searchParams = req.query.search,
		mediaId = req.query.mediaId,
		query;

	if (goalId) {
		query = {
			goals: goalId
		};
	} else if(issueId) {
		query = {
			issues: issueId
		};
	} else if(solutionId) {
		query = {
			solutions: solutionId
		};
	} else if (searchParams) {
		query = {
			title: {
				$regex: searchParams,
				$options: 'i'
			}
		};
	} else {
		query = null;
	}
	Media.find(query).sort('-created').populate('user', 'displayName').populate('issues').populate('goals').populate('solutions').exec(function (err, medias) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			votes.attachVotes(medias, req.user).then(function (mediaArr) {
				// console.log(mediaArr);
				res.json(mediaArr);
			}).catch(function (err) {
				res.status(500).send({
					message: errorHandler.getErrorMessage(err)
				});
			});
		}
	});
};

/**
 * Media middleware
 */
exports.mediaByID = function (req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Media is invalid'
		});
	}

	Media.findById(id).populate('user', 'displayName').populate('issues').populate('goals').populate('solutions').exec(function (err, media) {
		if (err) {
			return next(err);
		} else if (!media) {
			return res.status(404).send({
				message: 'No media with that identifier has been found'
			});
		}
		votes.attachVotes([media], req.user).then(function (mediaArr) {
			req.media = mediaArr[0];
			next();
		}).catch(next);
	});
};

exports.getMeta = function (req, res) {
	var url = req.params.uri;
	// console.log(url);
	return scrape(url).then(function (meta) {
		console.log(meta);

		var media = {};
		var title, description, image;
		if(meta.dublinCore && meta.dublinCore.title){
			title = meta.openGraph.title;
		}else if(meta.dublinCore && meta.openGraph.title){
			title = meta.openGraph.title;
		}else if(meta.general && meta.general.title) {
			title = meta.general.title;
		}

		if(meta.dublinCore && meta.dublinCore.description){
			description = meta.dublinCore.description;
		}else if(meta.openGraph && meta.openGraph.description){
			description = meta.openGraph.description;
		}else if(meta.general && meta.general.description) {
			description = meta.general.description;
		}

		if(meta.openGraph && meta.openGraph.image){
			image = meta.openGraph.image.url;
		}else if(meta.twitter && meta.twitter.description){
			image = meta.twitter.image;
		}

		media.title = title ? title : null;
		media.description = description ? description : null;
		media.image = image ? image : null;
		media.url = url;

		return res.json(media);
	}, function (error) {
		console.log('Error scraping: ', error.message);
		return res.status(400).send({
			message: 'No metadata found.'
		});
	});
};
