'use strict';

angular.module('core').controller('SolutionController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', '$stateParams', 'GoalService', 'SolutionService', '$q', '$mdDialog', 'VoteService', 'VOTE_TYPES', 'solution', 'UploadService', 'SortService', '$mdConstant',
	function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, $stateParams, GoalService, SolutionService, $q, $mdDialog, VoteService, VOTE_TYPES, solution, UploadService, SortService, $mdConstant) {
		// This provides Authentication context.
		var vm = this;
		vm.solution = solution;

		// console.log($stateParams);

		// Meta tags
		vm.desc = $rootScope.removeHtmlElements(vm.solution.description);
		vm.image = vm.solution.imageUrl;
		if ($state.is('solutions.solution')) {
			vm.desc = 'Proposed solution for the solution "' + vm.solution.title + '": ' + vm.solutions[0].title;
		}

		vm.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.SPACE];

		$scope.authentication = Authentication;
		$scope.prerender = document.getElementById('prerender');

		if ($stateParams.goalId) {
			vm.solution.goals = [];
			GoalService.get($stateParams.goalId).then(function (goal) {
				vm.solution.goals.push(goal);
			});
		}

		// Title
		vm.titleText = '';
		if (vm.solution._id && $state.is('solutions.edit')) {
			vm.titleText = 'Edit Solution - ' + vm.solution.title;
			$rootScope.headerTitle = vm.solution.title + ' (editing)';
		} else if ($state.is('solutions.create')) {
			vm.titleText = 'Add a Solution';
			$rootScope.headerTitle = 'Add Goal';
		}
		vm.title = $rootScope.titlePrefix + vm.titleText + $rootScope.titleSuffix;

		vm.createOrUpdate = function () {
			var promise = $q.resolve();
			if (vm.imageFile) {
				promise = UploadService.upload(vm.imageFile).then(function () {
					// console.log('uploaded file', vm.imageFile);
					vm.solution.imageUrl = vm.imageFile.result.url;
				});
			}
			return promise.then(function () {
				return SolutionService.createOrUpdate(vm.solution).then(function (solution) {
					$state.go('goals.view', {
						goalId: $stateParams.goalId
					});
				});
			});
		};

		vm.delete = function () {
			if (!vm.solution._id) return;

			confirm('Are you sure you want to delete this solution?',
				'This cannot be undone. Please confirm your decision').then(function () {
				SolutionService.delete(vm.solution._id).then(function () {
					$state.go('goals.view', {
						goalId: $stateParams.goalId
					});
				});
			});
		};

		vm.searchGoals = function (query) {
			return GoalService.list({
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
