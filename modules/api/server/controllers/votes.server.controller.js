'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Vote = mongoose.model('Vote'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a vote
 */
exports.create = function (req, res) {
  var vote = new Vote(req.body);
  vote.user = req.user;
  vote.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(vote);
    }
  });
};


exports.updateOrCreate = function(req, res) {
  var user = req.user;
  var object = req.body.object;
  Vote.findOne({
    user: user,
    object: object
  }).exec(function (err, vote) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!vote) {
      return exports.create(req, res);
    }
    req.vote = vote;
    return exports.update(req, res);
  });
};

/**
 * Show the current vote
 */
exports.read = function (req, res) {

  res.json(req.vote);
};

/**
 * Update a vote
 */
exports.update = function (req, res) {
  var vote = req.vote;
  _.extend(vote, req.body);
  // vote.title = req.body.title;
  // vote.content = req.body.content;

  vote.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(vote);
    }
  });
};

/**
 * Delete an vote
 */
exports.delete = function (req, res) {
  var vote = req.vote;

  vote.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(vote);
    }
  });
};

/**
 * List of Votes
 */
exports.list = function (req, res) {
  Vote.find().sort('-created').populate('user', 'displayName').exec(function (err, votes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(votes);
    }
  });
};

/**
 * Vote middleware
 */
exports.voteByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Vote is invalid'
    });
  }

  Vote.findById(id).populate('user', 'displayName').exec(function (err, vote) {
    if (err) {
      return next(err);
    } else if (!vote) {
      return res.status(404).send({
        message: 'No vote with that identifier has been found'
      });
    }
    req.vote = vote;
    next();
  });
};

exports.attachCurrentUserVotes = function(objects, user) {
  if(!user || !objects) return Promise.resolve(objects);
  var objectIds = objects.map(function(object) {
    return object._id;
  });
  return Vote.find({
    user: user,
    object: { $in: objectIds }
  }).exec().then(function(votes) {
    objects = objects.map(function(object) {
      object = object.toObject(); //to be able to set props on the mongoose object
      var vote = votes.find(function(vote) { return vote.object.toString()===object._id.toString(); });
      if(vote) object.currentUserVote = vote;
      return object;
    });
    return objects;
  });
};
