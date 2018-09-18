'use strict';

angular.module('users')
	.controller('AuthenticationController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', 'Users', 'CountryService', 'vcRecaptchaService', 'VerificationService',
		function ($scope, $rootScope, $state, $stateParams, $http, $location, $window, Authentication, PasswordValidator, Users, CountryService, vcRecaptchaService, VerificationService) {
			$scope.vm = this;
			var vm = $scope.vm;
			$scope.authentication = Authentication;
			$scope.popoverMsg = PasswordValidator.getPopoverMsg();
			if ($scope.authentication.user && $scope.authentication.user.data) {
				$scope.user = $scope.authentication.user.data;
			} else {
				$scope.user = $scope.authentication.user;
			}
			$scope.verificationStatus = {
				status: '',
				success: false,
				error: false,
				message: ''
			};
			// Update Title
			var titleText = '';
			if ($state.is('authentication.signin')) {
				titleText = 'Sign In';
			} else if ($state.is('authentication.signup')) {
				titleText = 'Join';
			} else if ($state.is('setup')) {
				titleText = 'Setup Profile';
			}
			$scope.title = $rootScope.titlePrefix + titleText + $rootScope.titleSuffix;
			$rootScope.headerTitle = titleText;

			// Get an eventual error defined in the URL query string:
			$scope.error = $location.search()
				.err;

			// If user is signed in then redirect back home
			if ($scope.authentication.user && $scope.authentication.user.terms) {
				$location.path('/');
			}

			//set up required variables for tabs
			if (!$scope.data) $scope.data = {};
			$scope.data.selectedIndex = 0;
			$scope.data.setupLocked = false;
			$scope.data.profileLocked = true;

			$scope.birthYears = [];
			var year = (new Date())
				.getFullYear();
			for (var i = 100; i--;) {
				$scope.birthYears.unshift(year - i);
			}

			vm.searchCountries = function (query) {
				return CountryService.list({
					search: query
				});
			};

			//recaptcha functions and variables
			$scope.recaptchaKey = '6Lca03AUAAAAALXV7A5FK-noIdCDZ7bpYwWoR2yy';
			$scope.recaptchaResponse = null;
			$scope.recaptchaWidgetId = null;

			$scope.setWidgetId = function(id) {
				console.log('set widget id to: ', id);
				$scope.recaptchaWidgetId = id;
			};

			$scope.setResponse = function(response) {
				console.log('set response to: ', response);
				$scope.credentials.recaptchaResponse = response;
			};

			$scope.cbExpiration = function() {
				console.log('callback expired');
				$scope.credentials.recaptchaResponse = null;
			};

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

			$scope.signup = function (isValid) {
				$scope.error = null;

				if (!isValid) {
					$scope.$broadcast('show-errors-check-validity', 'userForm');

					return false;
				}

				var test = PasswordValidator.getResult($scope.credentials.password);
				if(test.requiredTestErrors.length){
					$scope.error = test.errors;
					$scope.$broadcast('show-errors-check-validity', 'userForm');

					return false;
				}

				$http.post('/api/auth/signup', $scope.credentials)
					.then(function (response) {
							// If successful we assign the response to the global user model
							$scope.authentication.user = response.data;
							$window.user = response.data;

							// console.log('signup success, post data: ', response);

							// And redirect to the previous or home page
							if ($scope.authentication.user.terms) {
								$state.go($state.previous.state.name || 'home', $state.previous.params);
							} else {
								console.log('trying to go to setup state');
								$state.go('setup', { previous: $state.previous.state.name });
								console.log('$scope: ', $scope);
							}

						},
						function (response) {
							console.log('error in sign up: ', response);
							$scope.error = response.data.message;
							$scope.credentials.recaptchaResponse = null;
							vcRecaptchaService.reload($scope.recaptchaWidgetId);
						});
			};

			$scope.signin = function (isValid) {
				$scope.error = null;

				if (!isValid) {
					$scope.$broadcast('show-errors-check-validity', 'userForm');

					return false;
				}

				$http.post('/api/auth/signin', $scope.credentials)
					.then(function (response) {
							// If successful we assign the response to the global user model
							$scope.authentication.user = response.data;
							$window.user = response.data;

							// And redirect to the previous or home page
							if ($scope.authentication.user.terms) {
								$state.go($state.previous.state.name || 'home', $state.previous.params);
							} else {
								$state.go('setup', {
									previous: $state.previous.state.name
								});
							}
							$rootScope.$emit('login:success', $scope.authentication.user);
						},
						function (response) {
							console.log('error in sign in: ', response);
							$scope.error = response.data.message;
						});
			};

			$scope.update = function (isValid) {
				$scope.success = $scope.error = null;

				if (!isValid) {
					$scope.$broadcast('show-errors-check-validity', 'userForm');

					return false;
				}

				var user = new Users($scope.user);

				user.$update(function (response) {
					$scope.$broadcast('show-errors-reset', 'userForm');

					if (response.profileImageURL !== $scope.authentication.user.profileImageURL) {
						response.profileImageURL = $scope.authentication.user.profileImageURL;
					}

					$scope.success = true;
					$scope.authentication.user = response;
					$window.user = response;

					if ($stateParams.previous) {
						$state.go($stateParams.previous, $state.previous.params);
					} else {
						$state.go('home', $state.previous.params);
					}

				}, function (response) {
					$scope.error = response.data.message;
				});
			};

			$scope.setup = function (isValid) {
				$scope.success = $scope.error = null;

				if (!isValid) {
					$scope.$broadcast('show-errors-check-validity', 'userForm');

					return false;
				}

				var user = new Users($scope.user);

				user.$update(function (response) {

					$scope.$broadcast('show-errors-reset', 'userForm');

					$scope.success = true;
					$scope.authentication.user = response;
					$window.user = response;

					$scope.data.profileLocked = false;
					$scope.data.selectedIndex = 1;

				}, function (response) {
					$scope.error = response.data.message;
				});
			};

			$scope.skip = function () {
				if ($stateParams.previous) {
					$state.go($stateParams.previous, $state.previous.params);
				} else {
					$state.go('home', $state.previous.params);
				}
			};

			// OAuth provider request
			$scope.callOauthProvider = function (url) {
				console.log('oauth url:', url);
				if ($state.previous && $state.previous.href) {
					url += '?redirect_to=' + encodeURIComponent($state.previous.href);
				}

				// Effectively call OAuth authentication route:
				$window.location.href = url;
			};
		}
	]);
