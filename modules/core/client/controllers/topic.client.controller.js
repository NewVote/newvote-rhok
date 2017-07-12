'use strict';

angular.module('core').controller('IssueController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state',
  function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state) {
    // This provides Authentication context.
    var vm = this;
    vm.issue = 'TESTING 123456';
  }
]);
