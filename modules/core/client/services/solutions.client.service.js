'use strict';

angular.module('core').service('SolutionService', ['$resource', '$stateParams', '$q', '_',
  function ($resource, $stateParams, $q, _) {
    var Solution = $resource('api/solutions/:solutionId', { solutionId: '@_id' }, { update: { method: 'PUT' } });

    var svc = this;

    svc.get = function(solutionId) {
      return Solution.get({ solutionId: solutionId }).$promise;
    };

    svc.list = function(params) {
      return Solution.query(params).$promise;
    };

    svc.delete = function(solutionId) {
      var solution = new Solution({ _id: solutionId });
      return solution.$remove();
    };

    svc.createOrUpdate = function(solutionObj) {
      var solution = new Solution(solutionObj);
      return solution._id ? solution.$update() : solution.$save();
    };
  }
]);
