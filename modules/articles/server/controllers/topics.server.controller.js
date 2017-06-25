'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Topic = mongoose.model('Topic'),
  Topic = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a topic
 */
exports.create = function (req, res) {
  var topic = new Topic(req.body);

  topic.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(topic);
    }
  });
};

/**
 * Show the current topic
 */
exports.read = function (req, res) {

  res.json(req.topic);
};

/**
 * Update a topic
 */
exports.update = function (req, res) {
  var topic = req.topic;
  _.extend(topic, req.body);
  // topic.title = req.body.title;
  // topic.content = req.body.content;

  topic.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(topic);
    }
  });
};

/**
 * Delete an topic
 */
exports.delete = function (req, res) {
  var topic = req.topic;

  topic.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(topic);
    }
  });
};

/**
 * List of Topics
 */
exports.list = function (req, res) {
  Topic.find().sort('-created').populate('user', 'displayName').exec(function (err, topics) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(topics);
    }
  });
};

/**
 * Topic middleware
 */
exports.topicByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Topic is invalid'
    });
  }

  Topic.findById(id).populate('user', 'displayName').exec(function (err, topic) {
    if (err) {
      return next(err);
    } else if (!topic) {
      return res.status(404).send({
        message: 'No topic with that identifier has been found'
      });
    }
    req.topic = topic;
    next();
  });
};
