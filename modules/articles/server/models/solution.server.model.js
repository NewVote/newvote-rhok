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
  votes: [{
    type: Schema.ObjectId,
    ref: 'Vote'
  }],
  subsolutions: [{
    type: Schema.ObjectId,
    ref: 'Solution'
  }],
  comments: [{
    type: Schema.ObjectId,
    ref: 'Comment'
  }],
  issues: [{
    type: Schema.ObjectId,
    ref: 'Issue'
  }]
});

mongoose.model('Solution', SolutionSchema);
