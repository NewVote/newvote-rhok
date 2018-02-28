'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	_ = require('lodash'),
	mongoose = require('mongoose'),
	Vote = mongoose.model('Vote'),
	Goal = mongoose.model('Goal'),
	Solution = mongoose.model('Solution'),
	Media = mongoose.model('Media'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.all = function (req, res) {
	Vote.find()
		.lean()
		.select('user object objectType voteValue')
		.populate({
			path: 'user',
			select: 'international postalCode country gender birthYear income housing party',
			model: 'User',
			populate: {
				path: 'country',
				select: 'name code',
				model: 'Country'
			}
		})
		.exec()
		.then(function (votes) {
			votes = attachObjects(votes)
				.then(function (votes) {

					// console.log(votes)
					res.json(votes);
				})
			// Promise.all(votes).then(function(hmm) {
			// 	console.log(hmm)
			// 	res.json(hmm)
			// })
		})
}

function attachObjects(votes) {
	return Promise.all(votes.map(function (vote) {
		var type = vote.objectType;
		var objectID = vote.object;
		var object = {};
		//find the correct object (solution or goal) by objectId
		var model = {};
		if (type === 'Solution') {
			model = Solution;
		} else if (type === 'Goal') {
			model = Goal;
		} else if(type === 'Media') {
			model = Media;
		}
		else {
			return vote;
		}
		return model.findById(objectID)
			.select('title tags votes imageUrl description image')
			.exec()
			.then(function (object) {
				vote.object = object;
				return vote;
			});
	}))
	// return Promise.all(function () {
	// 	return votes.map(function (vote) {
	// 		//find the objectType for this vote
	// 		var type = vote.objectType;
	// 		var objectID = vote.object;
	// 		var object = {};
	// 		//find the correct object (solution or goal) by objectId
	// 		var model = {};
	// 		if (type === 'Solution') {
	// 			model = Solution;
	// 		} else if (type === 'Goal') {
	// 			model = Goal;
	// 		}
	//
	// 		model.findById(objectID)
	// 			.exec()
	// 			.then(function (object) {
	// 				console.log('found object: ', object.title)
	// 				vote.object = object.title;
	// 				return vote;
	// 			});
	// 	})
	// })
}
