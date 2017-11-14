'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;

    $scope.birthYears = [];
    var year = (new Date()).getFullYear();
    for (var i = 100;i--;) {
        $scope.birthYears.unshift(year - i);
    }
  }
]);
