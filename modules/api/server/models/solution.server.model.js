'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var SolutionSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    trim: true,
    required: 'Title cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  imageUrl: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  comments: [{
    type: Schema.ObjectId,
    ref: 'Comment'
  }],
  issues: [{
    type: Schema.ObjectId,
    ref: 'Issue',
    required: true
  }],
  currentUserVote: {
    type: Schema.ObjectId,
    ref: 'Vote'
  }
});

mongoose.model('Solution', SolutionSchema);
