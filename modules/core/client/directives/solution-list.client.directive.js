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
			controller: ['$scope', 'VoteService', 'SortService', 'Authentication', 'SocialshareService',
				function ($scope, VoteService, SortService, Authentication, SocialshareService) {
					var vm = this;
                    vm.sortSvc = SortService;
					$scope.authentication = Authentication;

					vm.vote = function (solution, voteType, $event) {
						$event.stopPropagation();
						VoteService.vote(solution, 'Solution', voteType).then(function(data) {
							solution.$get();
						});
					};
					vm.sort = function(sortData, $event) {
				        if($event) $event.stopPropagation();
				        console.log("sorting by: ", sortData.type, sortData.order);
				        SortService.setSort("solution", sortData.type, sortData.order);
					};

					vm.share = function(solution, provider) {
						SocialshareService.share({
							provider: provider,
							rel_url: '/solutions/' + solution._id,
							title: solution.title,
							hashtags: solution.tags.join()
						});
					};

					vm.controversialSort = function(a){
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
				}
			]
		};
	}]);
