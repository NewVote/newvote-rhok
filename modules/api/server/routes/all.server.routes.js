'use strict';

/**
 * Module dependencies.
 */
var policy = require('../policies/generic.server.policy'),
	issues = require('../controllers/issues.server.controller'),
	goals = require('../controllers/goals.server.controller'),
	solutions = require('../controllers/solutions.server.controller'),
  	suggestions = require('../controllers/suggestions.server.controller'),
	media = require('../controllers/media.server.controller'),
	endorsement = require('../controllers/endorsement.server.controller'),
	comments = require('../controllers/comments.server.controller'),
	votes = require('../controllers/votes.server.controller'),
	regions = require('../controllers/regions.server.controller'),
	countries = require('../controllers/countries.server.controller'),
	data = require('../controllers/data.server.controller');

module.exports = function (app) {
	// Articles collection routes
	app.route('/api/issues').all(policy.isAllowed)
		.get(issues.list)
		.post(issues.create);

	app.route('/api/goals').all(policy.isAllowed)
		.get(goals.list)
		.post(goals.create);

	app.route('/api/comments').all(policy.isAllowed)
		.get(comments.list)
		.post(comments.create);

	app.route('/api/votes').all(policy.isAllowed)
		.get(votes.list)
		.post(votes.updateOrCreate);

	app.route('/api/solutions').all(policy.isAllowed)
		.get(solutions.list)
		.post(solutions.create);

	app.route('/api/suggestions').all(policy.isAllowed)
		.get(suggestions.list)
		.post(suggestions.create);

		app.route('/api/endorsement').all(policy.isAllowed)
			.get(endorsement.list)
			.post(endorsement.create);

	app.route('/api/media').all(policy.isAllowed)
		.get(media.list)
		.post(media.create);

	app.route('/api/regions').all(policy.isAllowed)
		.get(regions.list)
		.post(regions.create);

	app.route('/api/countries').all(policy.isAllowed)
		.get(countries.list);

	app.route('/api/meta/:uri').all(policy.isAllowed)
		.get(media.getMeta);

	// Single article routes
	app.route('/api/issues/:issueId').all(policy.isAllowed)
		.get(issues.read)
		.put(issues.update)
		.delete(issues.delete);

	app.route('/api/goals/:goalId').all(policy.isAllowed)
		.get(goals.read)
		.put(goals.update)
		.delete(goals.delete);

	app.route('/api/comments/:commentId').all(policy.isAllowed)
		.get(comments.read)
		.put(comments.update)
		.delete(comments.delete);

	app.route('/api/votes/:voteId').all(policy.isAllowed)
		.get(votes.read)
		.put(votes.update)
		.delete(votes.delete);

	app.route('/api/solutions/:solutionId').all(policy.isAllowed)
		.get(solutions.read)
		.put(solutions.update)
		.delete(solutions.delete);

	app.route('/api/suggestions/:suggestionId').all(policy.isAllowed)
		.get(suggestions.read)
		.delete(suggestions.delete);

	app.route('/api/endorsement/:endorsementId').all(policy.isAllowed)
		.get(endorsement.read)
		.put(endorsement.update)
		.delete(endorsement.delete);

	app.route('/api/media/:mediaId').all(policy.isAllowed)
		.get(media.read)
		.put(media.update)
		.delete(media.delete);

	app.route('/api/regions/:regionId').all(policy.isAllowed)
		.get(regions.read)
		.put(regions.update)
		.delete(regions.delete);

	app.route('/api/countries/:countryId').all(policy.isAllowed)
		.get(countries.read);

	//this was to demonstrate how we might expose our voting data
	//it is not secure and should not be used this way in future
	// app.route('/api/raw/votes')
	// 	.get(data.all)

	// Finish by binding the article middleware
	app.param('issueId', issues.issueByID);
	app.param('goalId', goals.goalByID);
	app.param('solutionId', solutions.solutionByID);
	app.param('commentId', comments.commentByID);
	app.param('voteId', votes.voteByID);
	app.param('suggestionId', suggestions.suggestionByID);
	app.param('endorsementId', endorsement.endorsementByID);
	app.param('mediaId', media.mediaByID);
	app.param('regionId', regions.regionByID);
	app.param('countryId', countries.countryByID);
};
