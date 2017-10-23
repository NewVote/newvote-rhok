'use strict';

angular.module('core').controller('SolutionsController', ['$scope', '$stateParams', 'SolutionService', 'VoteService', 'Authentication', 'solutions', 'SocialshareService', '$location',
  function ($scope, $stateParams, SolutionService, VoteService, Authentication, solutions, SocialshareService, $location) {
    var vm = this;
    vm.issueId = $stateParams.issueId;
    vm.solutions = solutions;
    vm.sortParam = "votes.up";

    // Title
    vm.title = 'NewVote | Solutions';

    // Meta tags
    vm.desc = vm.desc = 'A collection of the current solutions being discussed on the NewVote platform.';
    vm.image = vm.solutions[0].imageUrl;
  }
]);
