'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
    console.log('id in user middleware: ', id);
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400)
			.send({
				message: 'User is invalid'
			});
	}

	User.findOne({
			_id: id
		})
		.populate('country')
		.exec(function (err, user) {
			if (err) {
				return next(err);
			} else if (!user) {
				return next(new Error('Failed to load User ' + id));
			}
			console.log('got user by id: ', user);
			req.profile = user;
			next();
		});
};
