'use strict';

angular.module('users')
	.controller('EditProfileController', ['$scope', '$rootScope', '$http', '$location', 'Users', 'Authentication', 'VerificationService',
		function ($scope, $rootScope, $http, $location, Users, Authentication, VerificationService) {
			$scope.user = Authentication.user;
			$scope.verificationStatus = {
				status: '',
				success: false,
				error: false,
				message: ''
			};

			// Update title
			$scope.title = $rootScope.titlePrefix + 'Edit Profile' + $rootScope.titleSuffix;
			$rootScope.headerTitle = 'Edit Profile';

			$scope.sendSMS = function () {
				console.log('attempting to send verification sms');
				$scope.verificationStatus.status = 'sending';
				return VerificationService.sendSMS({
						params: $scope.user.mobileNumber
					})
					.then(function (message) {
						console.log('success: ', message);
						$scope.verificationStatus.status = 'sent';
						$scope.verificationStatus.success = true;
						$scope.verificationStatus.error = false;
						$scope.verificationStatus.message = 'We have sent an SMS to your mobile number, you should receive it shortly.';
					})
					.catch(function (err) {
						console.log('critical error: ', err);
						$scope.verificationStatus.status = 'error';
						$scope.verificationStatus.success = false;
						$scope.verificationStatus.error = true;
						$scope.verificationStatus.message = 'Error: ' + err.data.message;
					});
			};

			$scope.verify = function () {
				console.log('attempting to verify code');
				return VerificationService.verify({
						params: $scope.user.verificationCode
					})
					.then(function (message) {
						console.log('success: ', message);
						$scope.verificationStatus.status = 'verified';
						$scope.verificationStatus.success = true;
						$scope.verificationStatus.error = false;
						$scope.verificationStatus.message = 'Success! Your account has been verified.';

						$scope.user.verified = true;
					})
					.catch(function (err) {
						console.log('critical error: ', err.data.message);
						$scope.verificationStatus.status = 'sent';
						$scope.verificationStatus.success = false;
						$scope.verificationStatus.error = true;
						$scope.verificationStatus.message = 'Error: ' + err.data.message;
					});
			};

			// Update a user profile
			$scope.updateUserProfile = function (isValid) {
				$scope.success = $scope.error = null;

				if (!isValid) {
					$scope.$broadcast('show-errors-check-validity', 'userForm');

					return false;
				}

				var user = new Users($scope.user);

				if (user.profileImageURL !== Authentication.user.profileImageURL) {
					user.profileImageURL = Authentication.user.profileImageURL;
				}

				user.$update(function (response) {
					$scope.$broadcast('show-errors-reset', 'userForm');

					$scope.success = true;
					Authentication.user = response;
				}, function (response) {
					$scope.error = response.data.message;
				});
			};
		}
	]);
