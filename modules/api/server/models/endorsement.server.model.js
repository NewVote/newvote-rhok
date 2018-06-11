'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var EndorsementSchema = new Schema({
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
		type: String,
		default: ''
	},
	organisationName: {
    type: String
  },
  organisationWebsite: {
    type: String
  },
	organisationImageURL: {
    type: String,
    default: ''
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
});

mongoose.model('Endorsement', EndorsementSchema);
