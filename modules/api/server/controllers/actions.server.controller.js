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
  var searchParams = req.query.search;
  var actionId = req.query.actionId;
  var query;
  if (solutionId) {
    // query = { solutions: solutionId };
    query = {
        $or: [{ solutions: solutionId },
            { solution: solutionId }]
    };
  } else if (searchParams) {
    query = { title: {
      $regex: searchParams,
      $options: 'i'
    } };
  } else {
    query = null;
  }
  Action.find(query).sort('-created').populate('user', 'displayName').exec(function (err, actions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      votes.attachVotes(actions, req.user, req.query.regions).then(function(actions) {
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
  .populate('solutions').populate('solution')
  .exec(function (err, action) {
    if (err) {
      return next(err);
    } else if (!action) {
      return res.status(404).send({
        message: 'No action with that identifier has been found'
      });
    }
    votes.attachVotes([action], req.user, req.query.regions).then(function(actionArr) {
      req.action = actionArr[0];
      next();
    }).catch(next);
  });
};
