'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Vote = mongoose.model('Vote'),
	Region = mongoose.model('Region'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	_ = require('lodash');

/**
 * Create a vote
 */
exports.create = function (req, res) {
	var vote = new Vote(req.body);
	vote.user = req.user;
	vote.save(function (err) {
		if (err) {
			return res.status(400)
				.send({
					message: errorHandler.getErrorMessage(err)
				});
		} else {
			res.json(vote);
		}
	});
};

exports.updateOrCreate = function (req, res) {
	var user = req.user;
	var object = req.body.object;
	Vote.findOne({
			user: user,
			object: object
		})
		.exec(function (err, vote) {
			if (err) {
				return res.status(400)
					.send({
						message: errorHandler.getErrorMessage(err)
					});
			} else if (!vote) {
				return exports.create(req, res);
			}
			req.vote = vote;
			return exports.update(req, res);
		});
};

/**
 * Show the current vote
 */
exports.read = function (req, res) {
	res.json(req.vote);
};

/**
 * Update a vote
 */
exports.update = function (req, res) {
	var vote = req.vote;
	_.extend(vote, req.body);
	// vote.title = req.body.title;
	// vote.content = req.body.content;

	vote.save(function (err) {
		if (err) {
			return res.status(400)
				.send({
					message: errorHandler.getErrorMessage(err)
				});
		} else {
			res.json(vote);
		}
	});
};

/**
 * Delete an vote
 */
exports.delete = function (req, res) {
	var vote = req.vote;

	vote.remove(function (err) {
		if (err) {
			return res.status(400)
				.send({
					message: errorHandler.getErrorMessage(err)
				});
		} else {
			res.json(vote);
		}
	});
};

/**
 * List of Votes
 */
exports.list = function (req, res) {
	var regionIds = req.query.regionId;

	if (regionIds) {
		getPostcodes(regionIds)
			.then(function (postCodes) {
				console.log(postCodes);
				// Find votes submitted from users with those postcodes
				getVotesResponse({}, {
					path: 'user',
					match: {
						postalCode: {
							$in: postCodes
						}
					},
					select: 'postalCode -_id'
				}, res);
			}, function (err) {
				return res.status(400)
					.send({
						message: errorHandler.getErrorMessage(err)
					});
			});

	} else {
		getVotesResponse({}, {
			path: 'user',
			select: 'postalCode -_id'
		}, res);
	}
};

/**
 * Vote middleware
 */
exports.voteByID = function (req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400)
			.send({
				message: 'Vote is invalid'
			});
	}

	Vote.findById(id)
		.populate('user', 'displayName')
		.exec(function (err, vote) {
			if (err) {
				return next(err);
			} else if (!vote) {
				return res.status(404)
					.send({
						message: 'No vote with that identifier has been found'
					});
			}
			req.vote = vote;
			next();
		});
};

exports.attachVotes = function (objects, user, regions) {
	// console.log('votes got object for attaching: ', objects)
	if (!objects) return Promise.resolve(objects);
	var objectIds = objects.map(function (object) {
		return object._id;
	});

	return Promise.resolve(regions)
		.then(function (regionString) {
			if (regionString) {
				var regionIds = [];

				if (isString(regionString)) {
					var region = JSON.parse(regionString);
					regionIds.push(region._id);
				} else {
					regionIds = regionString.map(function (regionObj) {
						var region = JSON.parse(regionObj);
						return region._id;
					});
				}

				return getPostcodes(regionIds)
					.then(function (postCodes) {
						// Find votes submitted from users with those postcodes
						return getVotes({
								object: {
									$in: objectIds
								}
							}, {
								path: 'user',
								match: {
									$or: [{
											postalCode: {
												$in: postCodes
											}
										},
										{
											woodfordian: {
												$in: postCodes
											}
										}
									]
								},
								select: 'postalCode -_id'
							})
							.then(function (votes) {
								return mapObjectWithVotes(objects, user, votes);
							});
					});

			} else {

				return getVotes({
						object: {
							$in: objectIds
						}
					}, null)
					.then(function (votes) {
						votes.forEach(function (vote) {
							fixVoteTypes(vote);
						})
						return mapObjectWithVotes(objects, user, votes);
					});

			}
		});
};

// Local functions
function fixVoteTypes(vote) {
	// fixing a bug where vote object types were being incorrectly set
	// now the database is populated with votes with objectType of 'solution'

	if (vote.objectType === 'solution') {
		console.log('found vote to fix');
		vote.objectType = 'Solution';
		vote.save().then(function(vote) {
			console.log('vote updated: ', vote._id);
		});
	}
}

function getVotesResponse(findQuery, populateQuery, res) {
	getVotes(findQuery, populateQuery)
		.then(function (votes) {
			res.json(votes);
		}, function (err) {
			return res.status(400)
				.send({
					message: errorHandler.getErrorMessage(err)
				});
		});
}

function getVotes(findQuery, populateQuery) {
	if (populateQuery != null) {
		return Vote.find(findQuery)
			.populate(populateQuery)
			.exec()
			.then(function (votes) {
				votes = votes.filter(function (vote) {
					if (vote.user) return vote;
				});
				return votes;
			});
	} else {
		return Vote.find(findQuery)
			.exec()
			.then(function (votes) {
				votes = votes.filter(function (vote) {
					if (vote.user) return vote;
				});
				return votes;
			});
	}
}

function getPostcodes(regionIds) {
	return Region.find({
			_id: {
				$in: regionIds
			}
		})
		.exec()
		.then(function (regions) {
			// Get postcodes from all regions
			var postCodes = [];
			var region;
			for (region in regions) {
				postCodes = postCodes.concat(regions[region].postcodes);
			}
			return postCodes;
		});
}

function mapObjectWithVotes(objects, user, votes) {
	objects = objects.map(function (object) {
		// object = object.toObject(); //to be able to set props on the mongoose object
		var objVotes = [];
		var userVote = null;
		var up = 0;
		var down = 0;
		object.votes = {};

		votes.forEach(function (vote) {
			if (vote.object.toString() === object._id.toString()) {
				objVotes.push(vote);
				if (user && vote.user.toString() === user._id.toString()) {
					userVote = vote;
				}
				if (vote.voteValue) {
					if (vote.voteValue > 0) up++;
					else down++;
				}
			}
		});

		object.votes = {
			total: objVotes.length,
			currentUser: userVote,
			up: up,
			down: down
		};

		return object;
	});

	return objects;
}

function isString(value) {
	return typeof value === 'string' || value instanceof String;
}
