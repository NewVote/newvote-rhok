'use strict';

angular.module('core').directive('solutionList', ['$timeout', function ($timeout) {
	return {
		restrict: 'E',
		scope: {
			solutions: '=',
			issueId: '='
		},
		templateUrl: 'modules/core/client/views/solutions-list.client.view.html',
		bindToController: true,
		controllerAs: 'vm',
		controller: ['$scope', '$window', 'VoteService', 'SortService', 'Authentication', 'SocialshareService', 'RegionService', 'SolutionService',
			function ($scope, $window, VoteService, SortService, Authentication, SocialshareService, RegionService, SolutionService) {
				var vm = this;
				vm.sortSvc = SortService;
				vm.regions = [];
				$scope.authentication = Authentication;

				vm.vote = function (solution, voteType, $event) {
					$event.stopPropagation();
					VoteService.vote(solution, 'Solution', voteType).then(function (data) {
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

				//this is just to show the controversial score in the UI
				vm.controversialSort = function (a) {
					var votes = a.solutionMetaData ? a.solutionMetaData.votes : a.votes;
					// var aUp = votes.up===0 ? 1 : votes.up;
					// return (votes.down / aUp) * votes.total;
					var diff = Math.abs(votes.up - votes.down);
					diff = diff ? diff : 1;
					var sum = votes.up + votes.down;
					sum = sum ? sum : 1;
					var percentDiff = Math.pow((diff / sum), -1);
					var multiplier = 0.5;
					return percentDiff * (votes.total * multiplier);
				};

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
						issueId: vm.issueId ? vm.issueId : null,
						regions: regions
					}).then(function (solutions) {
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
				}];
			}
		]
	};
}]);
