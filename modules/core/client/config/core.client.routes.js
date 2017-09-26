'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html',
      data: {
        title: 'NewVote'
      }
    })
    .state('user-verification-dummy', {
      url: '/userverification',
      templateUrl: 'modules/core/client/views/user-verification.client.view.html',
      data: {
        title: 'NewVote'
      }
    })

    .state('issues', {
      url: '/issues',
      abstract: true,
      template: '<ui-view/>'

    })
    .state('issues.list', {
      url: '/',
      templateUrl: 'modules/core/client/views/issues.client.view.html',
      controller: 'IssuesController',
      controllerAs: 'vm',
      data: {
        title: 'Issues'
      },
      resolve: {
        issues: ['IssueService', function(IssueService) {
          return IssueService.list();
        }]
      }
    })
    .state('issues.create', {
      url: '/create',
      templateUrl: 'modules/core/client/views/edit-issue.client.view.html',
      controller: 'IssueController',
      controllerAs: 'vm',
      data: {
        title: 'Create Issue',
        roles: ['user', 'admin']
      },
      resolve: {
        issue: function(){ return {}; },
        solutions: function(){ return {}; }
      }
    })
    .state('issues.edit', {
      url: '/:issueId/edit',
      templateUrl: 'modules/core/client/views/edit-issue.client.view.html',
      controller: 'IssueController',
      controllerAs: 'vm',
      data: {
        roles: ['user'],
        title: 'Edit Issue'
      },
      resolve: {
        issue: ['IssueService', '$stateParams', function(IssueService, $stateParams) {
          return IssueService.get($stateParams.issueId);
        }],
        solutions: function(){ return {}; }
      }
    })
    .state('issues.view', {
      url: '/:issueId',
      controller: 'IssueController',
      controllerAs: 'vm',
      templateUrl: 'modules/core/client/views/issue.client.view.html',
      resolve: {
        issue: ['IssueService', '$stateParams', function(IssueService, $stateParams) {
          return IssueService.get($stateParams.issueId);
        }],
        solutions: ['SolutionService', '$stateParams', function(SolutionService, $stateParams) {
          return SolutionService.list({ issueId: $stateParams.issueId });
        }]
      }
    })


    .state('solutions', {
      url: '/solutions',
      abstract: true,
      template: '<ui-view/>'
    })
    .state('solutions.list', {
      url: '/',
      templateUrl: 'modules/core/client/views/solutions.client.view.html',
      data: {
        title: 'All Solutions'
      },
      controller: 'SolutionsController',
      controllerAs: 'vm',
      resolve: {
        solutions: ['SolutionService', function(SolutionService) {
          return SolutionService.list();
        }]
      }
    })
    .state('solutions.create', {
      url: '/create?:issueId',
      templateUrl: 'modules/core/client/views/edit-solution.client.view.html',
      controller: 'SolutionController',
      controllerAs: 'vm',
      data: {
        roles: ['user'],
        title: 'Create Solution'
      },
      resolve: {
        solution: function() { return { issues: [] }; },
        actions: function() { return []; }
      }
    })
    .state('solutions.edit', {
      url: '/:solutionId/edit',
      templateUrl: 'modules/core/client/views/edit-solution.client.view.html',
      controller: 'SolutionController',
      controllerAs: 'vm',
      data: {
        roles: ['user'],
        title: 'Edit Solution'
      },
      resolve: {
        solution: ['SolutionService', '$stateParams', function(SolutionService, $stateParams) {
          return SolutionService.get($stateParams.solutionId);
        }],
        actions: function() { return []; }
      }
    })
    .state('solutions.view', {
      url: '/:solutionId',
      templateUrl: 'modules/core/client/views/solution.client.view.html',
      controller: 'SolutionController',
      controllerAs: 'vm',
      resolve: {
        solution: ['SolutionService', '$stateParams', function(SolutionService, $stateParams) {
          return SolutionService.get($stateParams.solutionId);
        }],
        actions: ['ActionService', '$stateParams', function(ActionService, $stateParams) {
          return ActionService.list({ solutionId: $stateParams.solutionId });
        }]
      }
    })

    // .state('results', {
    //   url: '/results',
    //   templateUrl: 'modules/core/client/views/results.client.view.html',
    //   data: {
    //     title: 'Results'
    //   }
    // })




    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);
