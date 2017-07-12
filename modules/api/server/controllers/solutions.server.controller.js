'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Solution = mongoose.model('Solution'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a solution
 */
exports.create = function (req, res) {
  var solution = new Solution(req.body);

  solution.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(solution);
    }
  });
};

/**
 * Show the current solution
 */
exports.read = function (req, res) {

  res.json(req.solution);
};

/**
 * Update a solution
 */
exports.update = function (req, res) {
  var solution = req.solution;
  _.extend(solution, req.body);
  // solution.title = req.body.title;
  // solution.content = req.body.content;

  solution.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(solution);
    }
  });
};

/**
 * Delete an solution
 */
exports.delete = function (req, res) {
  var solution = req.solution;

  solution.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(solution);
    }
  });
};

/**
 * List of Solutions
 */
exports.list = function (req, res) {
  Solution.find().sort('-created').populate('user', 'displayName').exec(function (err, solutions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(solutions);
    }
  });
};

/**
 * Solution middleware
 */
exports.solutionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Solution is invalid'
    });
  }

  Solution.findById(id).populate('user', 'displayName').exec(function (err, solution) {
    if (err) {
      return next(err);
    } else if (!solution) {
      return res.status(404).send({
        message: 'No solution with that identifier has been found'
      });
    }
    req.solution = solution;
    next();
  });
};
