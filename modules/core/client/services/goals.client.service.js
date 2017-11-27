'use strict';

angular.module('core').service('GoalService', ['$resource', '$stateParams', '$q', '_',
	function ($resource, $stateParams, $q, _) {
		var Goal = $resource('api/goals/:goalId', {
			goalId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});

		var svc = this;

		svc.get = function (goalId, regions) {
			console.log('getting by ID');
			return Goal.get({
				goalId: goalId,
				regions: regions
			}).$promise;
		};

		svc.list = function (params) {
			return Goal.query(params).$promise;
		};

		svc.delete = function (goalId) {
			var goal = new Goal({
				_id: goalId
			});
			return goal.$remove();
		};

		svc.createOrUpdate = function (goalObj) {
			var goal = new Goal(goalObj);
			return goal._id ? goal.$update() : goal.$save();
		};

		svc.searchGoals = function (query) {
			console.log('goal svc searching: ', query);
			return svc.list({
				search: query
			});
		};
	}
]);
