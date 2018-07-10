'use strict';

angular.module('users')
	.controller('EditProfileController', ['$scope', '$rootScope', '$http', '$location', 'Users', 'Authentication',
		function ($scope, $rootScope, $http, $location, Users, Authentication) {
			$scope.user = Authentication.user;

			// Update title
			$scope.title = $rootScope.titlePrefix + 'Edit Profile' + $rootScope.titleSuffix;
			$rootScope.headerTitle = 'Edit Profile';

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
