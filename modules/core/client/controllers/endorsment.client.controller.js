'use strict';

angular.module('core').controller('EndorsementController', ['$scope', '$rootScope', '$state', '$stateParams', 'Authentication', '$q', 'endorsement', 'IssueService', 'GoalService', 'SolutionService', 'EndorsementService',
	function ($scope, $rootScope, $state, $stateParams, Authentication, $q, endorsement, IssueService, GoalService, SolutionService, EndorsementService) {
		var vm = this;
		vm.endorsement = endorsement;

		// Title
		vm.title = 'NewVote | Create Endorsement';
		vm.desc = 'Create and submit Endorsement';
		var previousState = '';
		var stateData = null;
		$rootScope.pageTitle = 'Create Endorsement';
		vm.previewData = {};

		if ($stateParams.objectId && $stateParams.objectType) {
			if ($stateParams.objectType === 'issue') {
				IssueService.get($stateParams.objectId).then(function (issue) {
					previousState = 'issues.view';
					vm.endorsement.issues.push(issue);
					stateData = {
						issueId: issue._id
					};
				});
			} else if ($stateParams.objectType === 'goal') {
				GoalService.get($stateParams.objectId).then(function (goal) {
					previousState = 'goals.view';
					vm.endorsement.goals.push(goal);
					stateData = {
						goalId: goal._id
					};
				});
			} else if ($stateParams.objectType === 'solution') {
				SolutionService.get($stateParams.objectId).then(function (solution) {
					previousState = 'solutions.view';
					vm.endorsement.solutions.push(solution);
					stateData = {
						solutionId: solution._id
					};
				});
			}
		} else {
			//there was no previous object data so just set previous state to home page
			previousState = 'home';
		}

		if ($state.is('endorsement.edit')) {
			if ($stateParams.objectType === 'issue') {
				previousState = 'issues.view';
				stateData = {
					issueId: $stateParams.previousObjectId
				};
			} else if ($stateParams.objectType === 'goal') {
				previousState = 'goals.view';
				stateData = {
					goalId: $stateParams.previousObjectId
				};
			} else if ($stateParams.objectType === 'solution') {
				previousState = 'solutions.view';
				stateData = {
					solutionId: $stateParams.previousObjectId
				};
			}
		}

		vm.searchIssues = function (query) {
			return IssueService.list({
				search: query
			});
		};

		vm.searchGoals = function (query) {
			return GoalService.list({
				search: query
			});
		};

		vm.searchSolutions = function (query) {
			return SolutionService.list({
				search: query
			});
		};

		vm.createOrUpdate = function () {
			var promise = $q.resolve();
			return promise.then(function () {
				return EndorsementService.createOrUpdate(vm.endorsement).then(function (endorsement) {
					$state.go(previousState, stateData);
				});
			});
		};

		vm.delete = function (endorsement) {
			if (!endorsement._id) return;

			EndorsementService.delete(endorsement._id).then(function () {
				$state.go(previousState, stateData);
			});
		};

	}
]);
