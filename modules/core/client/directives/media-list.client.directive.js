'use strict';

angular.module('core').directive('mediaList', ['$timeout', function ($timeout) {
	return {
		restrict: 'E',
		scope: {
			media: '=',
			objectId: '=',
			objectType: '='
		},
		templateUrl: 'modules/core/client/views/media-list.client.view.html',
		bindToController: true,
		controllerAs: 'vm',
		controller: ['$scope', '$state', '$mdDialog', 'VoteService', 'SortService', 'Authentication', 'SocialshareService', 'MediaService',
			function ($scope, $state, $mdDialog, VoteService, SortService, Authentication, SocialshareService, MediaService) {
				var vm = this;
				vm.sortSvc = SortService;
				$scope.authentication = Authentication;

				vm.$onInit = function () {
					console.log(vm.objectType);
					vm.media.map(function (media) {
						//attaching the meta to all media in list
						media.meta = MediaService.getMeta(media.url);
						return media;
					});
				};

				vm.vote = function (media, voteType, $event) {
					$event.stopPropagation();
					VoteService.vote(media, 'Media', voteType).then(function (data) {
						// media.$get();
						// media.meta = MediaService.getMeta(media.url);
					});
				};

				vm.sort = function (sortData, $event) {
					if ($event) $event.stopPropagation();
					SortService.setSort('media', sortData.type, sortData.order);
				};

				vm.share = function (media, provider) {
					SocialshareService.share({
						provider: provider,
						rel_url: '/media/' + media._id,
						title: media.title,
						hashtags: media.tags.join()
					});
				};

				vm.delete = function (media) {
					if (!media._id) return;
					var confirm = $mdDialog.confirm()
						.title('Are you sure you want to delete this media?')
						.textContent('This cannot be undone. Please confirm your decision')
						.ok('Yes, I\'m sure')
						.cancel('No');

					$mdDialog.show(confirm).then(function () {
						MediaService.delete(media._id).then(function () {
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
