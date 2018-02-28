'use strict';

angular.module('core')
	.directive('solutionList', ['$timeout', function ($timeout) {
		return {
			restrict: 'E',
			scope: {
				solutions: '=',
				goalId: '=',
				issueId: '='
			},
			templateUrl: 'modules/core/client/views/solutions-list.client.view.html',
			bindToController: true,
			controllerAs: 'vm',
			controller: ['$scope', '$state', '$window', 'VoteService', 'SortService', 'Authentication', 'SocialshareService', 'RegionService', 'GoalService', 'SolutionService', '$mdDialog',
				function ($scope, $state, $window, VoteService, SortService, Authentication, SocialshareService, RegionService, GoalService, SolutionService, $mdDialog) {
					var vm = this;
					vm.sortSvc = SortService;
					vm.regions = [];
					$scope.authentication = Authentication;
					$scope.$state = $state;
					vm.goal = {};

					vm.$onInit = function () {
						if (vm.goalId) {
							GoalService.get(vm.goalId)
								.then(function (goal) {
									vm.goal = goal;
								});
						}
					};

					vm.vote = function (solution, voteType, $event) {
						$event.stopPropagation();
						VoteService.vote(solution, 'Solution', voteType)
							.then(function (data) {
								solution.$get();
							});
					};
					vm.sort = function (sortData, $event) {
						if ($event) $event.stopPropagation();
						SortService.setSort('solution', sortData.type, sortData.order);
					};

					vm.share = function (solution, provider) {
						SocialshareService.share({
							provider: provider,
							rel_url: '/solutions/' + solution._id,
							title: solution.title,
							hashtags: solution.tags.join()
						});
					};

					vm.deleteSolution = function (solution) {
						confirm('Are you sure you want to delete this solution?', 'This cannot be undone.')
							.then(function () {
								SolutionService.delete(solution._id)
									.then(function () {
										getSolutions();
									});
							});
					};

					function getSolutions() {
						SolutionService.list({
								goalId: vm.goalId ? vm.goalId : null,
								issueId: vm.issueId ? vm.issueId : null,
								regions: vm.regions ? vm.regions : null
							})
							.then(function (solutions) {
								vm.solutions = solutions;
							}, function (err) {
								console.log('Error getting solutions for goal: ', vm.goalId, err);
							});
					}

					function confirm(title, text) {
						var confirmDialog = $mdDialog.confirm()
							.title(title)
							.textContent(text)
							.ok('Yes')
							.cancel('No');

						return $mdDialog.show(confirmDialog);
					}

					vm.chartLabels = ['Against', 'For'];
					vm.chartOptions = {
						elements: {
							arc: {
								borderWidth: 0
							}
						},
						responsive: true,
						legend: {
							display: false
						}
					};

					vm.searchRegions = function (query) {
						return RegionService.searchRegions(query);
					};

					vm.updateVotes = function (regions) {
						SolutionService.list({
								goalId: vm.goalId ? vm.goalId : null,
								issueId: vm.issueId ? vm.issueId : null,
								regions: regions
							})
							.then(function (solutions) {
								console.log(solutions);
								vm.solutions = solutions;
							});
					};

					vm.chartColors = [{
							backgroundColor: 'rgba(255,0,0,0.8)',
							pointBackgroundColor: 'rgba(255,0,0,0.5)',
							pointHoverBackgroundColor: 'rgba(255,0,0,0.6)',
							borderColor: 'rgba(255,0,0,0.6)',
							pointBorderColor: 'rgba(255,0,0,0.6)',
							pointHoverBorderColor: 'rgba(255,0,0,0.6)'
						},
						{
							backgroundColor: 'rgba(0,255,0,0.8)',
							pointBackgroundColor: 'rgba(0,255,0,0.5)',
							pointHoverBackgroundColor: 'rgba(77,83,96,1)',
							borderColor: 'rgba(77,83,96,1)',
							pointBorderColor: '#fff',
							pointHoverBorderColor: 'rgba(77,83,96,0.8)'
						}
					];
				}
			]
		};
	}]);
