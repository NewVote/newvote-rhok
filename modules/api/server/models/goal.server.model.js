'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var GoalSchema = new Schema({
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
	votes: {
		up: Number,
		down: Number,
		total: Number,
		currentUser: {
			type: Schema.ObjectId,
			ref: 'Vote'
		}
	},
	tags: [{
		type: String,
		trim: true
	}],
	likert: {
		type: Boolean,
		default: false
	}
});

mongoose.model('Goal', GoalSchema);
