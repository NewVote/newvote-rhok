'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  topic = mongoose.model('topic'),
  topic = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a idea
 */
exports.create = function (req, res) {
  var idea = new topic(req.body);

  idea.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(idea);
    }
  });
};

/**
 * Show the current idea
 */
exports.read = function (req, res) {

  res.json(req.idea);
};

/**
 * Update a idea
 */
exports.update = function (req, res) {
  var idea = req.idea;
  _.extend(idea, req.body);
  // idea.title = req.body.title;
  // idea.content = req.body.content;

  idea.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(idea);
    }
  });
};

/**
 * Delete an idea
 */
exports.delete = function (req, res) {
  var idea = req.idea;

  idea.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(idea);
    }
  });
};

/**
 * List of topics
 */
exports.list = function (req, res) {
  topic.find().sort('-created').populate('user', 'displayName').exec(function (err, ideas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ideas);
    }
  });
};

/**
 * topic middleware
 */
exports.ideaByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'topic is invalid'
    });
  }

  topic.findById(id).populate('user', 'displayName').exec(function (err, idea) {
    if (err) {
      return next(err);
    } else if (!idea) {
      return res.status(404).send({
        message: 'No idea with that identifier has been found'
      });
    }
    req.idea = idea;
    next();
  });
};
  
