'use strict';

angular.module('core').service('ActionService', ['$resource', '$stateParams', '$q', '_',
  function ($resource, $stateParams, $q, _) {
    var Action = $resource('api/actions/:actionId', { actionId: '@_id' }, { update: { method: 'PUT' } });

    var svc = this;

    svc.get = function(actionId) {
      return Action.get({ actionId: actionId }).$promise;
    };

    svc.list = function(params) {
      return Action.query(params).$promise;
    };

    svc.delete = function(actionId) {
      var action = new Action({ _id: actionId });
      return action.$remove();
    };

    svc.createOrUpdate = function(actionObj) {
      var action = new Action(actionObj);
      return action._id ? action.$update() : action.$save();
    };
  }
]);
