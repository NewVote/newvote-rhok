'use strict';

angular.module('core').controller('SolutionsListController', ['$scope', '$stateParams', 'SolutionService', 'VoteService', 'Authentication',
  function ($scope, $stateParams, SolutionService, VoteService, Authentication) {
    var vm = this;
    $scope.authentication = Authentication;
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
