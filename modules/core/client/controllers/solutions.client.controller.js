'use strict';

angular.module('core').controller('SolutionsController', ['$scope', '$rootScope', '$stateParams', 'SolutionService', 'VoteService', 'Authentication', 'solutions', 'SocialshareService', '$location',
  function ($scope, $rootScope, $stateParams, SolutionService, VoteService, Authentication, solutions, SocialshareService, $location) {
    var vm = this;
    vm.issueId = $stateParams.issueId;
    vm.solutions = solutions;
    vm.sortParam = "votes.up";

    // Title
    vm.title = $rootScope.titlePrefix + 'Solutions' + $rootScope.titleSuffix;
    $rootScope.headerTitle = 'Solutions';

		// Meta tags
		vm.desc = vm.desc = 'A collection of the current solutions being discussed on the NewVote platform.';
		vm.image = vm.solutions[0].imageUrl;
	}
]);
