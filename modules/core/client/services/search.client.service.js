'use strict';

angular.module('core').service('SearchService', ['$resource', '$stateParams', '$q', '_',
    function ($resource, $stateParams, $q, _) {
        var Issue = $resource('api/issues/');
        var Solution = $resource('api/solutions/');
        var Action = $resource('api/actions/');    

        var svc = this;

        svc.searchIssues = function(text) {
            return Issue.query({ search: text }).$promise;
        };

        svc.searchSolutions = function(text) {
            return Solution.query({ search: text }).$promise;
        };

        svc.searchActions = function(text) {
            return Action.query({ search: text }).$promise;
        };

        svc.searchAll = function(text) {
            var issues = svc.searchIssues(text);
            var solutions = svc.searchSolutions(text);
            var actions = svc.searchActions(text);

            return Promise.all([issues, solutions, actions]).then( function(data) {
                var result = [];
                for (let item in data) {
                    result = result.concat(data[item]);
                }
                console.log(result);
                return result;
            });
        };
    }
]);
