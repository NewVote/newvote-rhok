'use strict';

angular.module('core').service('IssueService', ['$resource', '$stateParams', '$q', '_',
  function ($resource, $stateParams, $q, _) {
    var Issue = $resource('api/issues/:issueId', { issueId: '@_id' }, { update: { method: 'PUT' } });

    var svc = this;

    svc.get = function(issueId) {
      return Issue.get({ issueId: issueId }).$promise;
    };

    svc.list = function() {
      return Issue.query().$promise;
    };

    svc.delete = function(issueId) {
      var issue = new Issue({ _id: issueId });
      return issue.$remove();
    };

    svc.createOrUpdate = function(issueObj) {
      var issue = new Issue(issueObj);
      return issue._id ? issue.$update() : issue.$save();
    };
  }
]);
