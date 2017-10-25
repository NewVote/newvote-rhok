'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Media = mongoose.model('Media'),
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

exports.updateOrCreate = function (req, res) {
	var user = req.user;
	var object = req.body.object;
	Media.findOne({
		user: user,
		object: object
	}).exec(function (err, media) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else if (!media) {
			return exports.create(req, res);
		}
		req.media = media;
		return exports.update(req, res);
	});
};

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
	Media.find().sort('-created').populate('user', 'displayName').exec(function (err, medias) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(medias);
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

	Media.findById(id).populate('user', 'displayName').exec(function (err, media) {
		if (err) {
			return next(err);
		} else if (!media) {
			return res.status(404).send({
				message: 'No media with that identifier has been found'
			});
		}
		req.media = media;
		next();
	});
};

exports.attachMedia = function (objects, user) {
	if (!user || !objects) return Promise.resolve(objects);
	var objectIds = objects.map(function (object) {
		return object._id;
	});
	return Media.find({
		object: {
			$in: objectIds
		}
	}).exec().then(function (foundMedia) {
		objects = objects.map(function (object) {
			// object = object.toObject(); //to be able to set props on the mongoose object
			var objMedia = [];

			foundMedia.forEach(function (media) {
				if (media.object.toString() === object._id.toString()) {
					objMedia.push(media);
				}
			});

			object.media = objMedia;

			return object;
		});
		return objects;
	});
};

exports.getMeta = function(req, res) {
	var media = req.media;
	return scrape(media.url).then(function(meta) {
		console.log(meta);
		return meta;
	});
};
