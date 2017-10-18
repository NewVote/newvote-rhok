'use strict';

angular.module('core').service('SuggestionsService', ['$resource', '$stateParams', '$q', '_',
  function ($resource, $stateParams, $q, _) {
    var Suggestion = $resource('api/suggestions/:suggestionId', { suggestionId: '@_id' }, { update: { method: 'PUT' } });

    var svc = this;

    svc.get = function(suggestionId) {
      return Suggestion.get({ suggestionId: suggestionId }).$promise;
    };

    svc.list = function(params) {
      return Suggestion.query(params).$promise;
    };

    svc.delete = function(suggestionId) {
      var suggestion = new Suggestion({ _id: suggestionId });
      return suggestion.$remove();
    };

    svc.createOrUpdate = function(suggestionObj) {
      var suggestion = new Suggestion(suggestionObj);
      return suggestion._id ? suggestion.$update() : suggestion.$save();
    };
  }
]);
