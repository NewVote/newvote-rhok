'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	path = require('path'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	config = require(path.resolve('./config/config')),
	querystring = require('querystring'),
	request = require('request');

/**
 * User middleware
 */
exports.sendVerificationCode = function (req, res, next) {
	var user = req.user;
	var number = req.body.params;
	var code = User.generateVerificationCode();

	//send code via sms
	console.log(`sending code ${code} to user ${user.firstName.toString()} at ${number}`);
	var options = {
		'uri': 'https://api.smsbroadcast.com.au/api-adv.php',
		'qs': {
			'username': config.smsBroadcast.username,
			'password': config.smsBroadcast.password,
			'to': number,
			'from': 'NewVote',
			'message': `Hi ${user.firstName}, your verification code is ${code}`
		},
		useQueryString: true
	};

	request.get(options,
		function (error, response, body) {
			if (error) {
				return res.status(400)
					.send({ message: 'There was a problem sending your verification code: ' + error });
			}

			if (response.statusCode == 200) {
				var responseMessage = body.split(':');
				if (responseMessage[0] == 'OK') {
					saveVerificationCode(user, code, number, res);
				} else if (responseMessage[0] == 'BAD') {
					return res.status(400)
						.send({ message: 'There was a problem sending your verification code, please make sure the phone number you have entered is correct.' });
				} else if (responseMessage[0] == 'ERROR') {
					console.log('SMS BROADCAST ERROR: ' + responseMessage[1]);
					return res.status(400)
						.send({ message: 'There was a problem sending your verification code. There was an internal server error, please try again later.' });
				}else {
					console.log('SMS BROADCAST ERROR: ' + responseMessage[1]);
					return res.status(400)
						.send({ message: 'Something went wrong: ' + responseMessage[1] });
				}
			}else {
				return res.status(response.statusCode)
					.send({ message: 'There was a problem contacting the server.' });
			}
		}
	);

};

function saveVerificationCode(user, code, number, res) {
	//get the actual user because we need the salt
	User.findById(user.id)
		.then((user) => {
			if (!user) {
				return res.status(400)
					.send({ message: 'We could not find the user in the database. Please contact administration.' });
			}

			//add hashed code to users model
			user.verificationCode = user.hashVerificationCode(code);
			user.mobileNumber = number;

			//update user model
			user.save(function (err) {
				if (err) {
					console.log('error saving user: ', err);
					return res.status(400)
						.send({
							message: err
						});
				} else {
					return res.json({ 'message': 'success' });
				}
			});
		})
		.catch((err) => {
			console.log('error finding user: ', err);
			return res.status(400)
				.send({
					message: errorHandler.getErrorMessage(err)
				});
		});
}

exports.verify = function (req, res) {
	var user = req.user;
	var code = req.body.params;

	console.log(`Trying to verify ${code}`);

	//get the actual user because we need the salt
	User.findById(user.id)
		.then((user) => {
			if (!user) {
				return res.status(400)
					.send({ message: 'We could not find the user in the database. Please contact administration.' });
			}

			//add hashed code to users model
			var verified = user.verify(code);
			if (verified) {
				//update user model
				user.verified = verified;
				user.save(function (err) {
					if (err) {
						console.log('error saving user: ', err);
						return res.status(400)
							.send({
								message: err
							});
					} else {
						return res.json({ 'success': true });
					}
				});
			} else {
				return res.status(400)
					.send({
						message: 'Verification code was incorrect.'
					});
			}
		})
		.catch((err) => {
			console.log('error finding user: ', err);
			return res.status(400)
				.send({
					message: errorHandler.getErrorMessage(err)
				});
		});
};
