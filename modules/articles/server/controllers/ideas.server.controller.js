'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Idea = mongoose.model('Idea'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a idea
 */
exports.create = function (req, res) {
  var idea = new Idea(req.body);

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
 * List of Ideas
 */
exports.list = function (req, res) {
  Idea.find().sort('-created').populate('user', 'displayName').exec(function (err, ideas) {
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
 * Idea middleware
 */
exports.ideaByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Idea is invalid'
    });
  }

  Idea.findById(id).populate('user', 'displayName').exec(function (err, idea) {
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
