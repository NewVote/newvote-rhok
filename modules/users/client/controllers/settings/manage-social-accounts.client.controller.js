'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$rootScope', '$http', 'Authentication',
  function ($scope, $rootScope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Update title
    $scope.title = $rootScope.titlePrefix + 'Manage Social Media' + $rootScope.titleSuffix;
    $rootScope.headerTitle = 'Manage Social Media';
    

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).then(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);
