'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var MediaSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	title: {
		type: String
	},
	description: {
		type: String
	},
	image: {
		type: String
	},
	imageOnly: {
		type: Boolean,
		default: false
	},
	url: {
		type: String,
		required: true
	},
  issues: [{
		type: Schema.ObjectId,
		ref: 'Issue'
	}],
	goals: [{
		type: Schema.ObjectId,
		ref: 'Goal'
	}],
	solutions: [{
		type: Schema.ObjectId,
		ref: 'Solution'
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
});

mongoose.model('Media', MediaSchema);
