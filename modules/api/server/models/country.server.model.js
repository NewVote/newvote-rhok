'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Country Schema
 */
var CountrySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
      type: String,
      required: true
  }
});

mongoose.model('Country', CountrySchema);
