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

			.state('thanks', {
				url: '/thanks',
				templateUrl: 'modules/core/client/views/thanks.client.view.html',
				data: {
					title: 'Thank You'
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
					issues: ['IssueService', function (IssueService) {
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
					title: 'Create Issue'
				},
				resolve: {
					issue: function () {
						return {
							tags: []
						};
					},
					solutions: function () {
						return {};
					}
				}
			})
			.state('issues.edit', {
				url: '/:issueId/edit',
				templateUrl: 'modules/core/client/views/edit-issue.client.view.html',
				controller: 'IssueController',
				controllerAs: 'vm',
				data: {
					roles: ['admin'],
					title: 'Edit Issue'
				},
				resolve: {
					issue: ['IssueService', '$stateParams', function (IssueService, $stateParams) {
						return IssueService.get($stateParams.issueId);
					}],
					solutions: function () {
						return {};
					}
				}
			})
			.state('issues.view', {
				url: '/:issueId',
				controller: 'IssueController',
				controllerAs: 'vm',
				templateUrl: 'modules/core/client/views/issue.client.view.html',
				resolve: {
					issue: ['IssueService', '$stateParams', function (IssueService, $stateParams) {
						return IssueService.get($stateParams.issueId);
					}],
					solutions: ['SolutionService', '$stateParams', function (SolutionService, $stateParams) {
						return SolutionService.list({
							issueId: $stateParams.issueId
						});
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
					title: 'NewVote | Solutions'
				},
				controller: 'SolutionsController',
				controllerAs: 'vm',
				resolve: {
					solutions: ['SolutionService', function (SolutionService) {
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
					roles: ['admin'],
					title: 'Create Solution'
				},
				resolve: {
					solution: function () {
						return {
							issues: [],
							tags: []
						};
					},
					actions: function () {
						return [];
					},
					isSingleAction: function () {
						return false;
					}
				}
			})
			.state('solutions.edit', {
				url: '/:solutionId/edit',
				templateUrl: 'modules/core/client/views/edit-solution.client.view.html',
				controller: 'SolutionController',
				controllerAs: 'vm',
				data: {
					roles: ['admin'],
					title: 'Edit Solution'
				},
				resolve: {
					solution: ['SolutionService', '$stateParams', function (SolutionService, $stateParams) {
						return SolutionService.get($stateParams.solutionId);
					}],
					actions: function () {
						return [];
					},
					isSingleAction: function () {
						return false;
					}
				}
			})
			.state('solutions.view', {
				url: '/:solutionId',
				templateUrl: 'modules/core/client/views/solution.client.view.html',
				controller: 'SolutionController',
				controllerAs: 'vm',
				resolve: {
					solution: ['SolutionService', '$stateParams', function (SolutionService, $stateParams) {
						return SolutionService.get($stateParams.solutionId);
					}],
					actions: ['ActionService', '$stateParams', function (ActionService, $stateParams) {
						return ActionService.list({
							solutionId: $stateParams.solutionId
						});
					}],
					isSingleAction: function () {
						return false;
					}
				}
			})

			.state('solutions.action', {
				url: '/:solutionId/?:actionId',
				templateUrl: 'modules/core/client/views/solution.client.view.html',
				controller: 'SolutionController',
				controllerAs: 'vm',
				resolve: {
					solution: ['SolutionService', '$stateParams', function (SolutionService, $stateParams) {
						return SolutionService.get($stateParams.solutionId);
					}],
					actions: ['ActionService', '$stateParams', function (ActionService, $stateParams) {
						return ActionService.get($stateParams.actionId);
					}],
					isSingleAction: function () {
						return true;
					}
				}
			})

			.state('suggestions', {
				url: '/suggestions',
				templateUrl: 'modules/core/client/views/edit-suggestion.client.view.html',
				controller: 'SuggestionsController',
				controllerAs: 'vm',
				data: {
					title: 'Create Suggestion'
				}
			})

			.state('media', {
				url: '/media',
				abstract: true,
				template: '<ui-view/>'
			})

			.state('media.create', {
				url: '/create?:objectId',
				templateUrl: 'modules/core/client/views/edit-media.client.view.html',
				controller: 'MediaController',
				controllerAs: 'vm',
				data: {
					roles: ['admin'],
					title: 'Create Media'
				},
				resolve: {
					media: function () {
						return {
							issues: [],
							solutions: []
						};
					}
				}
			})
			.state('media.edit', {
				url: '/edit?:objectId',
				templateUrl: 'modules/core/client/views/edit-media.client.view.html',
				controller: 'MediaController',
				controllerAs: 'vm',
				data: {
					roles: ['admin'],
					title: 'Edit Media'
				},
				resolve: {
					media: ['MediaService', '$stateParams', function (MediaService, $stateParams) {
						return MediaService.get($stateParams.mediaId);
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
