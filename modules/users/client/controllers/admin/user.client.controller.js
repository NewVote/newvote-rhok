'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$rootScope', '$state', 'Authentication', 'userResolve',
  function ($scope, $rootScope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    // Update title
    var titleText = '';
    if ($state.is('admin.user')) {
			titleText = 'Admin | ' + userResolve.username;
		} else if ($state.is('admin.user-edit')) {
      titleText = 'Admin | Edit ' + userResolve.username;
    }
    $scope.title = $rootScope.titlePrefix + titleText + $rootScope.titleSuffix;
    $rootScope.headerTitle = titleText;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
