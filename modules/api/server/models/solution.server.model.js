'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var SolutionSchema = new Schema({
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
	goals: [{
		type: Schema.ObjectId,
		ref: 'Goal',
        required: true
	}],
	goal: {
		type: Schema.ObjectId,
		ref: 'Goal'
	},
	solutions: [{
		type: Schema.ObjectId,
		ref: 'Goal'
	}],
	solution: {
		type: Schema.ObjectId,
		ref: 'Goal'
	},
	votes: {
		up: Number,
		down: Number,
		total: Number,
		currentUser: {
			type: Schema.ObjectId,
			ref: 'Vote'
		}
	},
	likert: {
		type: Boolean,
		default: false
	}
});

mongoose.model('Solution', SolutionSchema);
