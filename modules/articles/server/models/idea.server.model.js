'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var IdeaSchema = new Schema({
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
  subideas: [{
    type: Schema.ObjectId,
    ref: 'Idea'
  }],
  comments: [{
    type: Schema.ObjectId,
    ref: 'Comment'
  }],
  topics: [{
    type: Schema.ObjectId,
    ref: 'Topic'
  }]
});

mongoose.model('Idea', IdeaSchema);
