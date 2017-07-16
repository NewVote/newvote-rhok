'use strict';

angular.module('core').controller('SolutionsListController', ['$scope', '$stateParams', 'SolutionService', 'VoteService',
  function ($scope, $stateParams, SolutionService, VoteService) {
    var vm = this;
    vm.issueId = $stateParams.issueId;

    SolutionService.list({ issueId: vm.issueId }).then(function(solutions) {
      vm.solutions = solutions;
    });

    vm.vote = function(solution, voteType, $event) {
      $event.stopPropagation();
      VoteService.vote(solution, 'Solution', voteType);
    };

  }
]);
