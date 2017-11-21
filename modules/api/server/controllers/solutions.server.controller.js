'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Solution = mongoose.model('Solution'),
  votes = require('./votes.server.controller'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a solution
 */
exports.create = function (req, res) {
  var solution = new Solution(req.body);
  solution.user = req.user;
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
  solution.user = req.user;
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
  var goalId = req.query.goalId;
  var searchParams = req.query.search;
  var solutionId = req.query.solutionId;
  var query;
  if (goalId) {
    query = {
        $or: [{ goals: goalId }, { goal: goalId }, { solutions: goalId }, { solution: goalId }]
    };
  } else if (searchParams) {
    query = { title: {
      $regex: searchParams,
      $options: 'i'
    } };
  } else {
    query = null;
  }
  Solution.find(query).sort('-created')
  .populate('user', 'displayName')
  .exec(function (err, solutions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      updateSchema(solutions);
      votes.attachVotes(solutions, req.user, req.query.regions).then(function(solutions) {
        res.json(solutions);
      }).catch(function(err) {
        res.status(500).send({
          message: errorHandler.getErrorMessage(err)
        });
      });
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

  Solution.findById(id).populate('user', 'displayName')
  .populate('goals').populate('goal')
  .exec(function (err, solution) {
    if (err) {
      return next(err);
    } else if (!solution) {
      return res.status(404).send({
        message: 'No solution with that identifier has been found'
      });
    }
    updateSchema(solution);
    votes.attachVotes([solution], req.user, req.query.regions).then(function(solutionArr) {
      req.solution = solutionArr[0];
      next();
    }).catch(next);
  });
};

function updateSchema(solutions) {
  console.log('schema update called');
  for (var i = 0; i < solutions.length; i++) {
    var sol = solutions[i];
    console.log('testing: ', sol);
    if((sol.solutions && sol.solutions.length > 0) || sol.solution) {
      if(sol.solution){
        console.log('found single solution: ', sol.solution);
        sol.goals = [sol.solution];
      }else{
        console.log('found solution array: ', sol.solutions);
        sol.goals = sol.solutions;
      }

      sol.solution = undefined;
      sol.solutions = undefined;

      sol.save();
    }
  }
}
