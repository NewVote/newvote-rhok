'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu',
  function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.toggleLeft = function() {
      $mdSidenav('left').toggle();
    };
    $rootScope.pageTitle = 'Idea name';

    $scope.openMenu = function($mdMenu, ev) {
      $mdMenu.open(ev);
    };
  }
]);
