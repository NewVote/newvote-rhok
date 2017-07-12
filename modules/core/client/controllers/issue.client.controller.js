'use strict';

angular.module('core').controller('IssueController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', '$stateParams', 'IssueService',
  function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, $stateParams, IssueService) {
    // This provides Authentication context.
    var vm = this;
    vm.issue = {};
    console.log('checking', $stateParams.issueId);
    if($stateParams.issueId) {
      IssueService.get($stateParams.issueId).then(function(issue) {
        vm.issue = issue;
        var title = vm.issue.name;
        if($state.includes('edit')) title = 'Edit Issue - ' + title;
        $rootScope.pageTitle = title;
      });
    }

    vm.createOrUpdate = function() {
      return IssueService.createOrUpdate(vm.issue).then(function(issue) {
        $state.go('issues.view', { issueId: issue._id });
      });
    };

    vm.delete = function() {
      if(!vm.issue._id) return;
      return IssueService.delete(vm.issue._id).then(function() {
        $state.go('issues.list');
      });
    };


  }
]);
