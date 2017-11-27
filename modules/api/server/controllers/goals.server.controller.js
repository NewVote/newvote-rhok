'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Goal = mongoose.model('Goal'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	votes = require('./votes.server.controller'),
	_ = require('lodash');

/**
 * Create a goal
 */
exports.create = function (req, res) {
	var goal = new Goal(req.body);
	goal.user = req.user;
	goal.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(goal);
		}
	});
};

/**
 * Show the current goal
 */
exports.read = function (req, res) {
	res.json(req.goal);
};

/**
 * Update a goal
 */
exports.update = function (req, res) {
	var goal = req.goal;
	_.extend(goal, req.body);
	// goal.title = req.body.title;
	// goal.content = req.body.content;

	goal.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(goal);
		}
	});
};

/**
 * Delete an goal
 */
exports.delete = function (req, res) {
	var goal = req.goal;

	goal.remove(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(goal);
		}
	});
};

/**
 * List of Goals
 */
exports.list = function (req, res) {
	var issueId = req.query.issueId;
	var searchParams = req.query.search;
	var query;
	if (issueId) {
		query = {
			issues: issueId
		};
	} else if (searchParams) {
		query = {
			$or: [{
					title: {
						$regex: req.query.search,
						$options: 'i'
					}
				},
				{
					description: {
						$regex: req.query.search,
						$options: 'i'
					}
				},
				{
					tags: req.query.search
				}
			]
		};
	} else {
		query = null;
	}

	Goal.find(query).sort('-created').populate('user', 'displayName').exec(function (err, goals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			votes.attachVotes(goals, req.user, req.query.regions).then(function (goals) {
				res.json(goals);
			}).catch(function (err) {
				// console.log(err);
				res.status(500).send({
					message: errorHandler.getErrorMessage(err)
				});
			});
		}
	});
};

/**
 * Goal middleware
 */
exports.goalByID = function (req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Goal is invalid'
		});
	}

	Goal.findById(id)
		.populate('user', 'displayName')
		.populate('issues').exec(function (err, goal) {
			if (err) {
				return next(err);
			} else if (!goal) {
				return res.status(404).send({
					message: 'No goal with that identifier has been found'
				});
			}
			votes.attachVotes([goal], req.user, req.query.regions).then(function (goalArr) {
				req.goal = goalArr[0];
				next();
			}).catch(next);
		});
};
