'use strict';

angular.module('core').controller('GoalsController', ['$scope', '$rootScope', '$stateParams', 'GoalService', 'VoteService', 'Authentication', 'goals', '$location',
  function ($scope, $rootScope, $stateParams, GoalService, VoteService, Authentication, goals, $location) {
    var vm = this;
    vm.issueId = $stateParams.issueId;
    vm.goals = goals;
    // vm.sortParam = 'votes.up-';

    // Title
    vm.title = $rootScope.titlePrefix + 'Goals' + $rootScope.titleSuffix;
    $rootScope.headerTitle = 'Goals';

		// Meta tags
		vm.desc = vm.desc = 'A collection of the current goals being discussed on the NewVote platform.';
		vm.image = vm.goals[0] ? vm.goals[0].imageUrl : null;
	}
]);
