'use strict';

angular.module('core').controller('SolutionController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', '$stateParams', 'SolutionService', 'IssueService', 'ActionService', '$q', '$mdDialog', 'VoteService', 'VOTE_TYPES', 'solution', 'actions', 'UploadService', 'SortService',
  function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, $stateParams, SolutionService, IssueService, ActionService, $q, $mdDialog, VoteService, VOTE_TYPES, solution, actions, UploadService, SortService) {
    // This provides Authentication context.
    var vm = this;
    vm.solution = solution;
    vm.newAction = {};
    vm.actions = actions;
    vm.sortSvc = SortService;

    $scope.authentication = Authentication;

    if($stateParams.issueId) {
      IssueService.get($stateParams.issueId).then(function(issue) {
        vm.solution.issues.push(issue);
      });
    }

    // Title
    vm.title = '';
    if(vm.solution._id && $state.is('solutions.edit')) {
      vm.title = 'Edit Solution - ' + vm.solution.title;
    } else if ($state.is('solutions.create')) {
      vm.title = 'Add a Solution';
    } else if ($state.is('solutions.view')) {
      vm.title = solution.title;
    }

    $rootScope.pageTitle = vm.title;

    // Meta tags
    vm.desc = vm.solution.description;
    vm.image = vm.solution.imageUrl;

    function getActions() {
      ActionService.list({ solutionId: $stateParams.solutionId }).then(function(actions) {
        vm.actions = actions;
      }, function(err) {
        console.log('Error getting actions for solution', $stateParams.solutionId, err);
      });
    }

    vm.createOrUpdate = function() {
      var promise = $q.resolve();
      if(vm.imageFile) {
        promise = UploadService.upload(vm.imageFile).then(function() {
          console.log('uploaded file', vm.imageFile);
          vm.solution.imageUrl = vm.imageFile.result.url;
        });
      }
      return promise.then(function() {
        return SolutionService.createOrUpdate(vm.solution).then(function(solution) {
          $state.go('solutions.view', { solutionId: solution._id });
        });
      });
    };

    vm.delete = function() {
      if(!vm.solution._id) return;

      confirm('Are you sure you want to delete this solution?',
      'This cannot be undone. Please confirm your decision').then(function() {
        SolutionService.delete(vm.solution._id).then(function() {
          $state.go('solutions.list');
        });
      });
    };

    vm.showCreateAction = function() {
      vm.creatingAction = !vm.creatingAction;
    };

    vm.createAction = function() {
      vm.newAction.solution = $stateParams.solutionId;
      ActionService.createOrUpdate(vm.newAction).then(function() {
        getActions();
        vm.creatingAction = false;
        vm.newAction = {};
      });
    };

    vm.searchIssues = function(query) {
      return IssueService.searchIssues(query);
    };

    vm.deleteAction = function(action) {
      confirm('Are you sure you want to delete this action?', 'This cannot be undone.').then(function() {
        ActionService.delete(action._id).then(function() {
          getActions();
        });
      });
    };

    vm.voteAction = function(action, voteType, $event) {
      $event.stopPropagation();
      VoteService.vote(action, 'Action', voteType);
    };

    vm.vote = function(voteType) {
      VoteService.vote(vm.solution, 'Solution', voteType);
    };

    vm.sort = function(sortParam, order, $event) {
        $event.stopPropagation();
        SortService.setSort("action", sortParam, order);
    };

    function confirm(title, text) {
      var confirmDialog = $mdDialog.confirm()
        .title(title)
        .textContent(text)
        .ok('Yes')
        .cancel('No');

      return $mdDialog.show(confirmDialog);
    }

    angular.element(document).find('script[src="https://pol.is/embed.js"]').remove();
    var el = angular.element('<script>').attr('src', 'https://pol.is/embed.js');
    angular.element(document).find('body').append(el);
  }
]);
