'use strict';

angular.module('core').controller('ActionController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', '$stateParams', 'SolutionService', 'ActionService', '$q', '$mdDialog', 'VoteService', 'VOTE_TYPES', 'action', 'UploadService', 'SortService', '$mdConstant',
	function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, $stateParams, SolutionService, ActionService, $q, $mdDialog, VoteService, VOTE_TYPES, action, UploadService, SortService, $mdConstant) {
		// This provides Authentication context.
		var vm = this;
		vm.action = action;

		// console.log($stateParams);

		// Meta tags
		vm.desc = $rootScope.removeHtmlElements(vm.action.description);
		vm.image = vm.action.imageUrl;
		if ($state.is('actions.action')) {
			vm.desc = 'Proposed action for the action "' + vm.action.title + '": ' + vm.actions[0].title;
		}

		vm.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.SPACE];

		$scope.authentication = Authentication;
		$scope.prerender = document.getElementById('prerender');

		if ($stateParams.solutionId) {
			SolutionService.get($stateParams.solutionId).then(function (solution) {
				vm.action.solutions.push(solution);
			});
		}

		// Title
		vm.titleText = '';
		if (vm.action._id && $state.is('actions.edit')) {
			vm.titleText = 'Edit Action - ' + vm.action.title;
			$rootScope.headerTitle = vm.action.title + ' (editing)';
		} else if ($state.is('actions.create')) {
			vm.titleText = 'Add a Action';
			$rootScope.headerTitle = 'Add Solution';
		}
		vm.title = $rootScope.titlePrefix + vm.titleText + $rootScope.titleSuffix;

		vm.createOrUpdate = function () {
			var promise = $q.resolve();
			if (vm.imageFile) {
				promise = UploadService.upload(vm.imageFile).then(function () {
					// console.log('uploaded file', vm.imageFile);
					vm.action.imageUrl = vm.imageFile.result.url;
				});
			}
			return promise.then(function () {
				return ActionService.createOrUpdate(vm.action).then(function (action) {
					$state.go('solutions.view', {
						solutionId: $stateParams.solutionId
					});
				});
			});
		};

		vm.delete = function () {
			if (!vm.action._id) return;

			confirm('Are you sure you want to delete this action?',
				'This cannot be undone. Please confirm your decision').then(function () {
				ActionService.delete(vm.action._id).then(function () {
					$state.go('solutions.view', {
						solutionId: $stateParams.solutionId
					});
				});
			});
		};

		vm.searchSolutions = function (query) {
			return SolutionService.list({
				search: query
			});
		};

		function confirm(title, text) {
			var confirmDialog = $mdDialog.confirm()
				.title(title)
				.textContent(text)
				.ok('Yes')
				.cancel('No');

			return $mdDialog.show(confirmDialog);
		}
	}
]);
