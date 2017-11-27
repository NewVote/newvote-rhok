'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication', 'CountryService',
  function ($scope, Authentication, CountryService) {
    $scope.user = Authentication.user;
    $scope.vm = this;

    $scope.birthYears = [];
    var year = (new Date()).getFullYear();
    for (var i = 100;i--;) {
        $scope.birthYears.unshift(year - i);
    }

    $scope.vm.searchCountries = function(query) {
        return CountryService.list({
            search: query
        });
    };
  }
]);
