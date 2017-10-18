'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Suggestion = mongoose.model('Suggestion'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	_ = require('lodash');

/**
 * Create a suggestion
 */
exports.create = function (req, res) {
	var suggestion = new Suggestion(req.body);
	suggestion.user = req.user;
	suggestion.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(suggestion);
		}
	});
};

/**
 * Show the current suggestion
 */
exports.read = function (req, res) {

	res.json(req.suggestion);
};

/**
 * Update a suggestion
 */
exports.update = function (req, res) {
	var suggestion = req.suggestion;
	_.extend(suggestion, req.body);
	// suggestion.title = req.body.title;
	// suggestion.content = req.body.content;

	suggestion.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(suggestion);
		}
	});
};

/**
 * Delete an suggestion
 */
exports.delete = function (req, res) {
	var suggestion = req.suggestion;

	suggestion.remove(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(suggestion);
		}
	});
};

/**
 * List of Suggestions
 */
exports.list = function (req, res) {
	var issueId = req.query.issueId;
	var solutionId = req.query.solutionId;
	var searchParams = req.query.search;
	var query;
	if (issueId) {
		query = {
			issues: issueId
		};
	} else if (solutionId) {
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

	Suggestion.find(query).sort('-created').populate('user', 'displayName').exec(function (err, suggestions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(suggestions);
		}
	});
};

/**
 * Suggestion middleware
 */
exports.suggestionByID = function (req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Suggestion is invalid'
		});
	}

	Suggestion.findById(id)
		.populate('user', 'displayName')
		.populate('issues').exec(function (err, suggestion) {
			if (err) {
				return next(err);
			} else if (!suggestion) {
				return res.status(404).send({
					message: 'No suggestion with that identifier has been found'
				});
			}
			req.suggestion = suggestion;
			next();
		});
};
