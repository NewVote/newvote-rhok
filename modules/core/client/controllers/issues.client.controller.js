'use strict';

angular.module('core').controller('IssuesController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', 'issues',
  function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, issues) {
    // This provides Authentication context.
    var vm = this;
    vm.issues = issues;
  }
]);
