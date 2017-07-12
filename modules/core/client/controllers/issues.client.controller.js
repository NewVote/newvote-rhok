'use strict';

angular.module('core').controller('IssuesController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', 'IssueService',
  function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, IssueService) {
    // This provides Authentication context.
    var vm = this;
    IssueService.list().then(function(issues) {
      vm.issues = issues;
    });
  }
]);
