'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var IssueSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
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
	goalMetaData: {
		votes: {
			up: Number,
			down: Number,
			total: Number
		},
		goalCount: Number,
		totalTrendingScore: Number,
		lastCreated: Date
	},
	tags: [{
		type: String,
		trim: true
	}]
});

mongoose.model('Issue', IssueSchema);
