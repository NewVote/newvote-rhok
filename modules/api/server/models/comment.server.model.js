'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var CommentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String,
    default: '',
    trim: true,
    required: 'Text cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Comment', CommentSchema);
