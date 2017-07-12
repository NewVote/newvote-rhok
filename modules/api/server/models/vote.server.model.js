'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var VoteSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  solution: {
    type: Schema.ObjectId,
    ref: 'Solution'
  }
});

mongoose.model('Vote', VoteSchema);
