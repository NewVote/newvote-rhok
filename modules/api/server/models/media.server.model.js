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
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
    issues: [{
		type: Schema.ObjectId,
		ref: 'Issue'
	}],
	solutions: [{
		type: Schema.ObjectId,
		refPath: 'Solution'
	}]
});

mongoose.model('Media', MediaSchema);
