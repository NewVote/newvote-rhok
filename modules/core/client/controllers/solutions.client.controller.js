'use strict';

angular.module('core').controller('SolutionsController', ['$scope', '$stateParams', 'SolutionService', 'VoteService', 'Authentication', 'solutions',
  function ($scope, $stateParams, SolutionService, VoteService, Authentication, solutions) {
    var vm = this;
    vm.issueId = $stateParams.issueId;
    vm.solutions = solutions;
    vm.sortParam = "votes.up";

    // Title
    vm.title = 'All Solutions';

    // Meta tags
    vm.desc = 'A list of solutions';
    vm.image = vm.solutions[0].imageUrl;

    vm.vote = function(solution, voteType, $event) {
      $event.stopPropagation();
      VoteService.vote(solution, 'Solution', voteType);
    };

  }
]);
