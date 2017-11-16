'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Region = mongoose.model('Region'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a region
 */
exports.create = function (req, res) {
  var region = new Region(req.body);
  region.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(region);
    }
  });
};

/**
 * Show the current region
 */
exports.read = function (req, res) {
  res.json(req.region);
};

/**
 * Update a region
 */
exports.update = function (req, res) {
  var region = req.region;
  region.name = req.body.name;
  region.postcodes = req.body.postcodes;

  region.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(region);
    }
  });
};

/**
 * Delete an region
 */
exports.delete = function (req, res) {
  var region = req.region;

  region.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(region);
    }
  });
};

/**
 * List of Regions
 */
exports.list = function (req, res) {
  var searchParams = req.query.search;
  var query;
  if (searchParams) {
    query = {
        $or: [{
                name: {
                    $regex: req.query.search,
                    $options: 'i'
                }
            },
            {
                postcodes: {
                    $regex: req.query.search,
                    $options: 'i'
                }
            },
            {
                suburbs: {
                    $regex: req.query.search,
                    $options: 'i'
                }
            }
        ]
    };
  } else {
    query = null;
  }
  Region.find(query, { postcodes: 0 }).exec(function (err, regions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(regions);
    }
  });
};

/**
 * Region middleware
 */
exports.regionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Region is invalid'
    });
  }

  Region.findById(id).exec(function (err, region) {
    if (err) {
      return next(err);
    } else if (!region) {
      return res.status(404).send({
        message: 'No region with that identifier has been found'
      });
    }
    req.region = region;
    next();
  });
};
