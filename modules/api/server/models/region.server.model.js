'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Region Schema
 */
var RegionSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  postcodes: [{
    type: String,
    required: true
  }],
});

mongoose.model('Region', RegionSchema);
