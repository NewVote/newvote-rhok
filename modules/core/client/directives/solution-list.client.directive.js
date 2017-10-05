'use strict';

angular.module('core')

	.directive('solutionList', ['$timeout', function ($timeout) {
		return {
			restrict: 'E',
			scope: {
				solutions: '=',
				issueId: '='
			},
			templateUrl: 'modules/core/client/views/solutions-list.client.view.html',
			bindToController: true,
			controllerAs: 'vm',
			controller: ['$scope', 'VoteService', 'SortService',
				function ($scope, VoteService, SortService) {
					var vm = this;
                    vm.sortSvc = SortService;

					vm.vote = function (solution, voteType, $event) {
						$event.stopPropagation();
						VoteService.vote(solution, 'Solution', voteType);
					};
					vm.sort = function (sortParam, order, $event) {
						$event.stopPropagation();
						SortService.setSort("solution", sortParam, order);
					};
				}
			]
		};
	}]);
