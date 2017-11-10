'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var SuggestionSchema = new Schema({
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
  issues: [{
      type: Schema.ObjectId,
      ref: 'Issue',
      required: false
  }],
  solutions: [{
      type: Schema.ObjectId,
      ref: 'Solution',
      required: false
  }],
  type: {
      type: String,
      default: '',
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Suggestion', SuggestionSchema);
