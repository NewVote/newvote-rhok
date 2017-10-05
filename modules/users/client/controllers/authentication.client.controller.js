'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$stateParams', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', 'Users',
	function ($scope, $state, $stateParams, $http, $location, $window, Authentication, PasswordValidator, Users) {
		$scope.authentication = Authentication;
		$scope.popoverMsg = PasswordValidator.getPopoverMsg();
        if($scope.authentication.user.data){
            $scope.user = $scope.authentication.user.data;
        }else {
            $scope.user = $scope.authentication.user;
        }

		// Get an eventual error defined in the URL query string:
		$scope.error = $location.search().err;

		// If user is signed in then redirect back home
		if ($scope.authentication.user && $scope.authentication.user.terms) {
			$location.path('/');
		}

		$scope.signup = function (isValid) {
			$scope.error = null;

			if (!isValid) {
				$scope.$broadcast('show-errors-check-validity', 'userForm');

				return false;
			}

			$http.post('/api/auth/signup', $scope.credentials).then(function (response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response.data;
                $window.user = response.data;

				// And redirect to the previous or home page
                if($scope.user.terms){
                    $state.go($state.previous.state.name || 'home', $state.previous.params);
                }else {
                    $state.go('setup', {previous: $state.previous.state.name});
                }

			}).error(function (response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function (isValid) {
			$scope.error = null;

			if (!isValid) {
				$scope.$broadcast('show-errors-check-validity', 'userForm');

				return false;
			}

			$http.post('/api/auth/signin', $scope.credentials).then(function (response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response.data;
				$window.user = response.data;

				// And redirect to the previous or home page
                if($scope.user.terms){
                    $state.go($state.previous.state.name || 'home', $state.previous.params);
                }else {
                    $state.go('setup', {previous: $state.previous.state.name});
                }
			}).error(function (response) {
				$scope.error = response.message;
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

                $scope.success = true;
                $scope.authentication.user = response;
                $window.user = response;


                if($stateParams.previous){
                    $state.go($stateParams.previous, $state.previous.params);
                }else {
                    $state.go('home', $state.previous.params);
                }

            }, function (response) {
                $scope.error = response.data.message;
            });
        };

		// OAuth provider request
		$scope.callOauthProvider = function (url) {
			if ($state.previous && $state.previous.href) {
				// url += '?redirect_to=' + encodeURIComponent($state.previous.href);
                url += '?redirect_to=' + encodeURIComponent($state.href('setup')) + encodeURIComponent($state.previous.state.name);
			}

			// Effectively call OAuth authentication route:
			$window.location.href = url;
		};
	}
]);
