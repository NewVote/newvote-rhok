'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$rootScope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $rootScope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Update title
    $scope.title = $rootScope.titlePrefix + 'Change Password' + $rootScope.titleSuffix;
    $rootScope.headerTitle = 'Change Password';

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).then(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);
