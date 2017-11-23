'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Country = mongoose.model('Country'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a country
 */
exports.create = function (req, res) {
  var country = new Country(req.body);
  country.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(country);
    }
  });
};

/**
 * Show the current country
 */
exports.read = function (req, res) {
  res.json(req.country);
};

/**
 * Update a country
 */
exports.update = function (req, res) {
  var country = req.country;
  country.name = req.body.name;
  country.postcodes = req.body.postcodes;

  country.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(country);
    }
  });
};

/**
 * Delete an country
 */
exports.delete = function (req, res) {
  var country = req.country;

  country.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(country);
    }
  });
};

/**
 * List of Countries
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
            }
        ]
    };
  } else {
    query = null;
  }
  Country.find(query).exec(function (err, countries) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(countries);
    }
  });
};

/**
 * Country middleware
 */
exports.countryByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Country is invalid'
    });
  }

  Country.findById(id).exec(function (err, country) {
    if (err) {
      return next(err);
    } else if (!country) {
      return res.status(404).send({
        message: 'No country with that identifier has been found'
      });
    }
    req.country = country;
    next();
  });
};
