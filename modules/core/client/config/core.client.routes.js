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

    .state('issues', {
      url: '/issues',
      abstract: true,
      template: '<ui-view/>'

    })
    .state('issues.list', {
      url: '/',
      templateUrl: 'modules/core/client/views/issues.client.view.html',
      data: {
        title: 'Issues'
      }
    })
    .state('issues.create', {
      url: '/create',
      templateUrl: 'modules/core/client/views/create-issue.client.view.html',
      data: {
        title: 'Create Issue'
      }
    })
    .state('issues.view', {
      url: '/:issueId',
      templateUrl: 'modules/core/client/views/issue.client.view.html',
      data: {
        title: 'Global Warming'
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
        title: 'Solutions'
      }
    })
    .state('solutions.create', {
      url: '/create',
      templateUrl: 'modules/core/client/views/create-solution.client.view.html',
      data: {
        title: 'Create Solution'
      }
    })
    .state('solutions.view', {
      url: '/:solutionId',
      templateUrl: 'modules/core/client/views/solution.client.view.html',
      data: {
        title: 'We should do our part for global warming'
      }
    })

    .state('results', {
      url: '/results',
      templateUrl: 'modules/core/client/views/results.client.view.html',
      data: {
        title: 'Results'
      }
    })




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
