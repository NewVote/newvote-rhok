'use strict';

/**
 * Module dependencies.
 */
var articlesPolicy = require('../policies/articles.server.policy'),
  topics = require('../controllers/topics.server.controller'),
  ideas = require('../controllers/ideas.server.controller'),
  comments = require('../controllers/comments.server.controller'),
  votes = require('../controllers/votes.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/topics').all(articlesPolicy.isAllowed)
    .get(topics.list)
    .post(topics.create);

  app.route('/api/ideas').all(articlesPolicy.isAllowed)
    .get(ideas.list)
    .post(ideas.create);

  app.route('/api/comments').all(articlesPolicy.isAllowed)
    .get(comments.list)
    .post(comments.create);

  app.route('/api/votes').all(articlesPolicy.isAllowed)
    .get(votes.list)
    .post(votes.create);

  // Single article routes
  app.route('/api/topics/:topicId').all(articlesPolicy.isAllowed)
    .get(topics.read)
    .put(topics.update)
    .delete(topics.delete);

  app.route('/api/ideas/:ideaId').all(articlesPolicy.isAllowed)
    .get(ideas.read)
    .put(ideas.update)
    .delete(ideas.delete);

  app.route('/api/comments/:commentId').all(articlesPolicy.isAllowed)
    .get(comments.read)
    .put(comments.update)
    .delete(comments.delete);

  app.route('/api/votes/:voteId').all(articlesPolicy.isAllowed)
    .get(votes.read)
    .put(votes.update)
    .delete(votes.delete);

  // Finish by binding the article middleware
  console.log(topics);
  app.param('topicId', topics.topicByID);
  app.param('ideaId', ideas.ideaByID);
  app.param('commentId', comments.commentByID);
  app.param('voteId', votes.voteByID);
};
