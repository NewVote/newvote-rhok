'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Suggestion = mongoose.model('Suggestion'),
	Issue = mongoose.model('Issue'),
	Goal = mongoose.model('Goal'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	nodemailer = require('nodemailer'),
	transporter = nodemailer.createTransport(),
	_ = require('lodash');


var buildMessage = function(suggestion, req) {
	var messageString = '';
	var url = req.protocol + '://' + req.get('host');
	messageString += '<h3>' + suggestion.title + '</h3>';
	if(suggestion.issues) {
		messageString += '<p>Related issues: ';
		for (var i = 0; i < suggestion.issues.length; i++) {
			var issue = suggestion.issues[i];
			messageString += '<a target="_blank" href="' + url + '/issues/' + issue._id + '">' + issue.name + '</a> ';
		}
		messageString += '</p>';
	}
	if(suggestion.goals) {
		messageString += '<p>Related Goals: ';
		for (var x = 0; x < suggestion.goals.length; x++) {
			var goal = suggestion.goals[x];
			messageString += '<a target="_blank" href="' + url + '/goals/' + goal._id + '">' + goal.title + '</a> ';
		}
		messageString += '</p>';
	}

	messageString += '<p>User: ' + suggestion.user.firstName + ' ' + suggestion.user.lastName + '</p>';
	messageString += 'Message: ' + suggestion.description;

	return messageString;
};

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
			Suggestion.populate(suggestion, { path: 'issues goals user' }).then(function(suggestion) {
				// console.log(buildMessage(suggestion, req));
				// console.log(process.env);
				transporter.sendMail({
					from: process.env.MAILER_FROM,
					// to: 'dion@newvote.org.au',
					to: process.env.MAILER_TO,
					replyTo: req.user.email,
					subject: 'NewVote Suggestion',
					html: buildMessage(suggestion, req)
				}).then(function(data) {
					console.log('mailer success: ', data);
				}, function(err) {
					console.log('mailer failed: ', err);
				});
			});
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
	var goalId = req.query.goalId;
	var searchParams = req.query.search;
	var query;
	if (issueId) {
		query = {
			issues: issueId
		};
	} else if (goalId) {
		query = {
			goals: goalId
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
		.populate('issues').populate('goals').exec(function (err, suggestion) {
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
