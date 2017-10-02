'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ActionSchema = new Schema({
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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  solution: {
    type: Schema.ObjectId,
    ref: 'Solution'
  },
  votes: {
    up: Number,
    down: Number,
    total: Number,
    currentUser: {
      type: Schema.ObjectId,
      ref: 'Vote'
    }
  }
});

mongoose.model('Action', ActionSchema);
