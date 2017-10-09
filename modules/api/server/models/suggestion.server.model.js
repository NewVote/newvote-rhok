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
  type: {
      type: String,
      default: '',
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  issues: [{
    type: Schema.ObjectId,
    ref: 'Issue',
    required: true
  }],
  solution: {
      type: Schema.ObjectId,
      ref: 'Solution',
      required: true
  }
});

mongoose.model('Suggestion', SuggestionSchema);
