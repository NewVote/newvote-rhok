'use strict';

angular.module('core').service('SearchService', ['$resource', '$stateParams', '$q', '_', '$state',
    function ($resource, $stateParams, $q, _, $state) {
        var Issue = $resource('api/issues/');
        var Solution = $resource('api/solutions/');
        var Action = $resource('api/actions/');    

        var modelEnum = {
            issue: 0,
            solution: 1,
            action: 2
        };

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
                var results = [];
                for (var model in data) {
                    for (var item in data[model]) {

                        // Valid objects have numbers as keys
                        if (!isNaN(item)) {

                            switch (parseInt(model)) {

                                case modelEnum.issue: 
                                    data[model][item].model = 'Issue';
                                    break;

                                case modelEnum.solution: 
                                    data[model][item].model = 'Solution';
                                    break;

                                case modelEnum.action: 
                                    data[model][item].model = 'Action';
                                    break;

                            }
                            results.push(data[model][item]);
                        }
                    }
                }
                return results;
            });
        };

        svc.getItemTitle = function(item) {
            // Issues 
            if (item.name !== undefined) {
                return item.name; 

            // Solutions and Actions
            } else if (item.title !== undefined) {
                return item.title; 
            }
        };

        svc.redirectTo = function(item) {
            switch (item.model) {

                case 'Issue':
                    $state.go('issues.view', {issueId: item._id});
                    break;

                case 'Solution':
                    $state.go('solutions.view', {solutionId: item._id});
                    break;

                case 'Action':
                    $state.go('solutions.view', {solutionId: item.solution});
                    break;

            }       
        };
    }
]);
