'use strict';

angular.module('core').directive('endorsementList', ['$timeout', function ($timeout) {
	return {
		restrict: 'E',
		scope: {
			endorsement: '=',
			objectId: '=',
			objectType: '='
		},
		templateUrl: 'modules/core/client/views/endorsement-list.client.view.html',
		bindToController: true,
		controllerAs: 'vm',
		controller: ['$scope', '$state', '$mdDialog', 'VoteService', 'SortService', 'Authentication', 'SocialshareService', 'EndorsementService',
			function ($scope, $state, $mdDialog, VoteService, SortService, Authentication, SocialshareService, EndorsementService) {
				var vm = this;
				vm.sortSvc = SortService;
				$scope.authentication = Authentication;

				vm.vote = function (endorsement, voteType, $event) {
					$event.stopPropagation();
					VoteService.vote(endorsement, 'Endorsement', voteType).then(function (data) {
						// endorsement.$get();
						// endorsement.meta = EndorsementService.getMeta(endorsement.url);
					});
				};

				vm.sort = function (sortData, $event) {
					if ($event) $event.stopPropagation();
					SortService.setSort('endorsement', sortData.type, sortData.order);
				};

				vm.share = function (endorsement, provider) {
					SocialshareService.share({
						provider: provider,
						rel_url: '/endorsement/' + endorsement._id,
						title: endorsement.title,
						hashtags: endorsement.tags.join()
					});
				};

				vm.delete = function (endorsement) {
					if (!endorsement._id) return;
					var confirm = $mdDialog.confirm()
						.title('Are you sure you want to delete this endorsement?')
						.textContent('This cannot be undone. Please confirm your decision')
						.ok('Yes, I\'m sure')
						.cancel('No');

					$mdDialog.show(confirm).then(function () {
						EndorsementService.delete(endorsement._id).then(function () {
							if ($state.is('issues.view')) {
								$state.go('issues.view', {
									issueId: vm.objectId
								}, {
									reload: true
								});
							} else if ($state.is('goals.view')) {
								$state.go('issues.view', {
									goalId: vm.objectId
								});
							} else if ($state.is('solutions.view')) {
								$state.go('solutions.view', {
									solutionId: vm.objectId
								});
							}

						});
					});
				};
			}
		]
	};
}]);
