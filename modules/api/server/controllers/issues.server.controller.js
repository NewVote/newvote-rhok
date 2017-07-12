'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Issue = mongoose.model('Issue'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a issue
 */
exports.create = function (req, res) {
  var issue = new Issue(req.body);

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
  Issue.find().sort('-created').populate('user', 'displayName').exec(function (err, issues) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(issues);
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
    req.issue = issue;
    next();
  });
};
