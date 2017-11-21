'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Issue = mongoose.model('Issue'),
	IssuesController = require('./issues.server.controller'),
	votes = require('./votes.server.controller'),
	Goal = mongoose.model('Goal'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	_ = require('lodash');

/**
 * Create a issue
 */
exports.create = function (req, res) {
	var issue = new Issue(req.body);
	issue.user = req.user;
	issue.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(issue);
		}
	});
};

/**
 * Show the current issue
 */
exports.read = function (req, res) {

	res.json(req.issue);
};

/**
 * Update a issue
 */
exports.update = function (req, res) {
	var issue = req.issue;
	_.extend(issue, req.body);
	// issue.title = req.body.title;
	// issue.content = req.body.content;

	issue.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(issue);
		}
	});
};

/**
 * Delete an issue
 */
exports.delete = function (req, res) {
	var issue = req.issue;

	issue.remove(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(issue);
		}
	});
};

/**
 * List of Issues
 */
exports.list = function (req, res) {
	var searchParams = req.query.search ? {
		$or: [{
				name: {
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
	} : null;

	// console.log('query is: ', searchParams.$or[0].name.$regex);

	Issue.find(searchParams).sort('-created').populate('user', 'displayName').exec(function (err, issues) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			IssuesController.attachMetaData(issues, req.user).then(function (issues) {
				res.json(issues);
			}).catch(function (err) {
				res.status(500).send({
					message: errorHandler.getErrorMessage(err)
				});
			});
		}
	});
};

/**
 * Issue middleware
 */
exports.issueByID = function (req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Issue is invalid'
		});
	}

	Issue.findById(id).populate('user', 'displayName').exec(function (err, issue) {
		if (err) {
			return next(err);
		} else if (!issue) {
			return res.status(404).send({
				message: 'No issue with that identifier has been found'
			});
		}
		IssuesController.attachMetaData([issue], req.user).then(function (issueArr) {
			req.issue = issueArr[0];
			next();
		}).catch(next);
	});
};

exports.attachMetaData = function (issues, user) {
	if (!issues) return Promise.resolve(issues);

	var issueIds = issues.map(function (issue) {
		return issue._id;
	});

	return Goal.find({
		issues: {
			$in: issueIds
		}
	}).sort('-created').exec().then(function (goals) {
		return votes.attachVotes(goals, user).then(function (goals) {
			issues = issues.map(function (issue) {

				var up = 0,
					down = 0,
					total = 0,
					goalCount = 0,
					totalTrendingScore = 0,
					lastCreated = issue.created;

				//looping through each issue passed in to exported method

				goals.forEach(function (goal) {
					//loop through each goal found in the db

					//must check that this goal belongs to the current issue being tested
					if (goal.issues.indexOf(issue._id.toString()) !== -1) {
						//found issue id inside goal issues array
						var currentDate = new Date(lastCreated);
						var date = new Date(goal.created);
						var nowDate = new Date();
						var age = (nowDate.getTime() - date.getTime()) / (1000 * 60 * 60);

						up += goal.votes.up;
						down += goal.votes.down;
						total += goal.votes.total;
						goalCount++;
						totalTrendingScore += (goal.votes.up / age);
						lastCreated = date > lastCreated ? date : lastCreated;
					}
				});

				issue.goalMetaData = {
					votes: {
						up: up,
						down: down,
						total: total
					},
					goalCount: goalCount,
					totalTrendingScore: totalTrendingScore,
					lastCreated: lastCreated
				};

				// console.log(issue.goalMetaData);

				return issue;
			});
			return issues;
		});
	});
};
