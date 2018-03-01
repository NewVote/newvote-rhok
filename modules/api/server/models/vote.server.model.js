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
  objectType: {
    type: String,
    required: true
  },
  object: {
    type: Schema.ObjectId,
    refPath: 'objectType'
  },
  voteValue: {
    type: Number,
    enum: ['0', '1', '-1', '0.5', '-0.5']
  }
});

VoteSchema.index({ object: 1, user: 1 }, { unique: true });

mongoose.model('Vote', VoteSchema);
