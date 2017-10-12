'use strict';

angular.module('core').controller('IssuesController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', 'issues', 'SortService',
  function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, issues, SortService) {
    // This provides Authentication context.
    var vm = this;
    vm.issues = issues;
    vm.sortSvc = SortService;

    vm.sort = function(sortData, $event) {
        if($event) $event.stopPropagation();
        console.log("sorting by: ", sortData.type, sortData.order);
        SortService.setSort("issue", sortData.type, sortData.order);
    };
  }
]);
