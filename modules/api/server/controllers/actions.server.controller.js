'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Action = mongoose.model('Action'),
  votes = require('./votes.server.controller'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a action
 */
exports.create = function (req, res) {
  var action = new Action(req.body);
  action.user = req.user;
  action.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(action);
    }
  });
};

/**
 * Show the current action
 */
exports.read = function (req, res) {

  res.json(req.action);
};

/**
 * Update a action
 */
exports.update = function (req, res) {
  var action = req.action;
  _.extend(action, req.body);
  // action.title = req.body.title;
  // action.content = req.body.content;
  action.user = req.user;
  action.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(action);
    }
  });
};

/**
 * Delete an action
 */
exports.delete = function (req, res) {
  var action = req.action;

  action.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(action);
    }
  });
};

/**
 * List of Actions
 */
exports.list = function (req, res) {
  var solutionId = req.query.solutionId;
  var query = solutionId ? { solution: solutionId } : null;
  Action.find(query).sort('-created').populate('user', 'displayName').exec(function (err, actions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      votes.attachCurrentUserVotes(actions, req.user).then(function(actions) {
        res.json(actions);
      }).catch(function(err) {
        res.status(500).send({
          message: errorHandler.getErrorMessage(err)
        });
      });
    }
  });
};

/**
 * Action middleware
 */
exports.actionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Action is invalid'
    });
  }

  Action.findById(id).populate('user', 'displayName')
  .populate('solution')
  .exec(function (err, action) {
    if (err) {
      return next(err);
    } else if (!action) {
      return res.status(404).send({
        message: 'No action with that identifier has been found'
      });
    }
    votes.attachCurrentUserVotes([action], req.user).then(function() {
      req.action = action;
      next();
    }).catch(next);
  });
};
