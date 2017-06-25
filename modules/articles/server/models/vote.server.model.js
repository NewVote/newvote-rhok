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
  idea: {
    type: Schema.ObjectId,
    ref: 'Idea'
  }
});

mongoose.model('Vote', VoteSchema);
