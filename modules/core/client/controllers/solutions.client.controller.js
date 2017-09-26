'use strict';

angular.module('core').controller('SolutionsController', ['$scope', '$stateParams', 'SolutionService', 'VoteService', 'Authentication', 'solutions',
  function ($scope, $stateParams, SolutionService, VoteService, Authentication, solutions) {
    var vm = this;
    vm.issueId = $stateParams.issueId;
    vm.solutions = solutions;

    vm.vote = function(solution, voteType, $event) {
      $event.stopPropagation();
      VoteService.vote(solution, 'Solution', voteType);
    };

  }
]);
