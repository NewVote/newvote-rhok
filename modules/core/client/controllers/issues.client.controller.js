'use strict';

angular.module('core').controller('IssuesController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', 'issues', 'SortService',
  function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, issues, SortService) {
    // This provides Authentication context.
    var vm = this;
    vm.issues = issues;
    vm.sortSvc = SortService;

    vm.sort = function(sortParam, order, $event) {
        $event.stopPropagation();
        SortService.setSort("issue", sortParam, order);
    };
  }
]);
