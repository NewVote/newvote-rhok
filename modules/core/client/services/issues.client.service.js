'use strict';

angular.module('core').service('IssueService', ['$resource', '$stateParams', '$q', '_',
  function ($resource, $stateParams, $q, _) {
    var Issue = $resource('api/issues/:issueId', { issueId: '@_id' }, { update: { method: 'PUT' } });

    var svc = this;

    svc.get = function(issueId) {
      return Issue.get({ issueId: issueId }).$promise;
    };

    svc.list = function(params) {
      return Issue.query(params).$promise;
    };

    svc.delete = function(issueId) {
      var issue = new Issue({ _id: issueId });
      return issue.$remove();
    };

    svc.createOrUpdate = function(issueObj) {
      var issue = new Issue(issueObj);
      return issue._id ? issue.$update() : issue.$save();
    };

    svc.searchIssues = function(query) {
      return svc.list({ search: query });
    };
  }
]);
