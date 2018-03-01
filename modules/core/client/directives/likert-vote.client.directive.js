'use strict';

angular.module('core').directive('likertVote', ['$timeout', function ($timeout) {
	return {
		restrict: 'E',
		scope: {
			object: '=',
			objectType: '=',
			size: '='
		},
		templateUrl: 'modules/core/client/views/likert-vote.client.view.html',
		bindToController: true,
		controllerAs: 'vm',
		controller: ['$scope', '$state', '$mdDialog', 'VoteService', 'Authentication',
			function ($scope, $state, $mdDialog, VoteService, SortService, Authentication, SocialshareService, EndorsementService) {
				var vm = this;
				$scope.authentication = Authentication;

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

				vm.vote = function (object, voteType, $event) {
					$event.stopPropagation();
					VoteService.vote(object, vm.objectType, voteType).then(function (data) {
						object.$get();
					});
				};
			}
		]
	};
}]);
