'use strict';

// Setting up route
angular.module('core')
	.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {

			// Redirect to 404 when route not found
			$urlRouterProvider.otherwise(function ($injector, $location) {
				$injector.get('$state')
					.transitionTo('not-found', null, {
						location: false
					});
			});

			// Home state routing
			$stateProvider
				.state('home', {
					url: '/',
					templateUrl: 'modules/core/client/views/home.client.view.html',
					controller: 'HomeController',
					controllerAs: 'vm',
					data: {
						title: 'NewVote'
					}
				})

				.state('thanks', {
					url: '/thanks',
					templateUrl: 'modules/core/client/views/thanks.client.view.html',
					controller: 'ThanksController',
					data: {
						title: 'Thank You'
					}
				})

				.state('about-us', {
					url: '/about-us',
					templateUrl: 'modules/core/client/views/about.client.view.html',
					controller: 'AboutController',
					controllerAs: 'vm',
					data: {
						title: 'NewVote'
					}
				})

				.state('help', {
					url: '/help',
					templateUrl: 'modules/core/client/views/help.client.view.html',
					controller: 'HelpController',
					controllerAs: 'vm',
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
						roles: ['admin'],
						title: 'Create Issue'
					},
					resolve: {
						issue: function () {
							return {
								tags: []
							};
						},
						goals: function () {
							return {};
						},
						solutions: function () {
							return [];
						},
						media: function () {
							return [];
						},
						endorsement: function () {
							return [];
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
						goals: function () {
							return {};
						},
						solutions: function () {
							return [];
						},
						media: function () {
							return [];
						},
						endorsement: function () {
							return [];
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
						goals: ['GoalService', '$stateParams', function (GoalService, $stateParams) {
							return GoalService.list({
								issueId: $stateParams.issueId
							});
						}],
						solutions: ['SolutionService', '$stateParams', function (SolutionService, $stateParams) {
							return SolutionService.list({
								issueId: $stateParams.issueId
							});
						}],
						media: ['MediaService', '$stateParams', function (MediaService, $stateParams) {
							return MediaService.list({
								issueId: $stateParams.issueId
							});
						}],
						endorsement: ['EndorsementService', '$stateParams', function (EndorsementService, $stateParams) {
							return EndorsementService.list({
								issueId: $stateParams.issueId
							});
						}]
					}
				})

				.state('goals', {
					url: '/goals',
					abstract: true,
					template: '<ui-view/>'
				})
				.state('goals.list', {
					url: '/',
					templateUrl: 'modules/core/client/views/goals.client.view.html',
					data: {
						title: 'NewVote | Goals'
					},
					controller: 'GoalsController',
					controllerAs: 'vm',
					resolve: {
						goals: ['GoalService', function (GoalService) {
							return GoalService.list();
						}]
					}
				})
				.state('goals.create', {
					url: '/create?:issueId',
					templateUrl: 'modules/core/client/views/edit-goal.client.view.html',
					controller: 'GoalController',
					controllerAs: 'vm',
					data: {
						roles: ['admin'],
						title: 'Create Goal'
					},
					resolve: {
						goal: function () {
							return {
								issues: [],
								tags: []
							};
						},
						solutions: function () {
							return [];
						},
						media: function () {
							return [];
						},
						endorsement: function () {
							return [];
						},
						isSingleSolution: function () {
							return false;
						}
					}
				})
				.state('goals.edit', {
					url: '/:goalId/edit',
					templateUrl: 'modules/core/client/views/edit-goal.client.view.html',
					controller: 'GoalController',
					controllerAs: 'vm',
					data: {
						roles: ['admin'],
						title: 'Edit Goal'
					},
					resolve: {
						goal: ['GoalService', '$stateParams', function (GoalService, $stateParams) {
							return GoalService.get($stateParams.goalId);
						}],
						solutions: function () {
							return [];
						},
						media: function () {
							return [];
						},
						isSingleSolution: function () {
							return false;
						},
						endorsement: function () {
							return [];
						}
					}
				})
				.state('goals.view', {
					url: '/:goalId',
					templateUrl: 'modules/core/client/views/goal.client.view.html',
					controller: 'GoalController',
					controllerAs: 'vm',
					resolve: {
						goal: ['GoalService', '$stateParams', function (GoalService, $stateParams) {
							return GoalService.get($stateParams.goalId);
						}],
						solutions: ['SolutionService', '$stateParams', function (SolutionService, $stateParams) {
							return SolutionService.list({
								goalId: $stateParams.goalId
							});
						}],
						media: ['MediaService', '$stateParams', function (MediaService, $stateParams) {
							return MediaService.list({
								goalId: $stateParams.goalId
							});
						}],
						endorsement: ['EndorsementService', '$stateParams', function (EndorsementService, $stateParams) {
							return EndorsementService.list({
								goalId: $stateParams.goalId
							});
						}],
						isSingleSolution: function () {
							return false;
						}
					}
				})

				.state('goals.solution', {
					url: '/:goalId/?:solutionId',
					templateUrl: 'modules/core/client/views/goal.client.view.html',
					controller: 'GoalController',
					controllerAs: 'vm',
					resolve: {
						goal: ['GoalService', '$stateParams', function (GoalService, $stateParams) {
							return GoalService.get($stateParams.goalId);
						}],
						solutions: ['SolutionService', '$stateParams', function (SolutionService, $stateParams) {
							return SolutionService.get($stateParams.solutionId);
						}],
						media: ['MediaService', '$stateParams', function (MediaService, $stateParams) {
							return MediaService.list({
								goalId: $stateParams.goalId
							});
						}],
						isSingleSolution: function () {
							return true;
						}
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
					url: '/create?:goalId',
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
								goals: []
							};
						},
						goals: function () {
							return [];
						},
						media: function () {
							return [];
						},
						endorsement: function () {
							return [];
						},
						isSingleSolution: function () {
							return true;
						}
					}
				})
				.state('solutions.edit', {
					url: '/:solutionId/edit',
					templateUrl: 'modules/core/client/views/edit-solution.client.view.html',
					controller: 'SolutionController',
					controllerAs: 'vm',
					params: {
						solutionId: null,
						goalId: null
					},
					data: {
						roles: ['admin'],
						title: 'Edit Solution'
					},
					resolve: {
						solution: ['SolutionService', '$stateParams', function (SolutionService, $stateParams) {
							return SolutionService.get($stateParams.solutionId);
						}],
						goals: function () {
							return [];
						},
						media: function () {
							return [];
						},
						endorsement: function () {
							return [];
						},
						isSingleSolution: function () {
							return true;
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
						goals: ['GoalService', '$stateParams', function (GoalService, $stateParams) {
							return GoalService.list({
								solutionId: $stateParams.solutionId
							});
						}],
						media: ['MediaService', '$stateParams', function (MediaService, $stateParams) {
							return MediaService.list({
								solutionId: $stateParams.solutionId
							});
						}],
						endorsement: ['EndorsementService', '$stateParams', function (EndorsementService, $stateParams) {
							return EndorsementService.list({
								solutionId: $stateParams.solutionId
							});
						}],
						isSingleSolution: function () {
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
						roles: ['admin', 'user'],
						title: 'Create Suggestion'
					},
					params: { 'objectId': null, 'objectType': null, 'suggestionType': null },
					resolve: {
						suggestion: function () {
							return {
								issues: [],
								goals: []
							};
						}
					}
				})

				.state('media', {
					url: '/media',
					abstract: true,
					template: '<ui-view/>'
				})

				.state('media.create', {
					url: '/create',
					templateUrl: 'modules/core/client/views/edit-media.client.view.html',
					controller: 'MediaController',
					controllerAs: 'vm',
					data: {
						roles: ['admin'],
						title: 'Create Media'
					},
					params: {
						objectId: null,
						objectType: null
					},
					resolve: {
						media: function () {
							return {
								issues: [],
								goals: []
							};
						}
					}
				})
				.state('media.edit', {
					url: '/edit?:mediaId&:previousObjectId&:objectType',
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

				.state('endorsement', {
					url: '/endorsement',
					abstract: true,
					template: '<ui-view/>'
				})

				.state('endorsement.create', {
					url: '/create',
					templateUrl: 'modules/core/client/views/edit-endorsement.client.view.html',
					controller: 'EndorsementController',
					controllerAs: 'vm',
					data: {
						roles: ['endorser'],
						title: 'Create Endorsement'
					},
					params: {
						objectId: null,
						objectType: null
					},
					resolve: {
						endorsement: function () {
							return {
								issues: [],
								goals: []
							};
						}
					}
				})
				.state('endorsement.edit', {
					url: '/edit?:endorsementId&:previousObjectId&:objectType',
					templateUrl: 'modules/core/client/views/edit-endorsement.client.view.html',
					controller: 'EndorsementController',
					controllerAs: 'vm',
					data: {
						roles: ['admin', 'endorser'],
						title: 'Edit Endorsement'
					},
					resolve: {
						endorsement: ['EndorsementService', '$stateParams', function (EndorsementService, $stateParams) {
							return EndorsementService.get($stateParams.endorsementId);
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

				.state('privacy', {
					url: '/privacy',
					templateUrl: 'modules/core/client/views/privacy.client.view.html',
					bindToController: true,
					controllerAs: 'vm',
					controller: ['$scope', '$rootScope', '$state',
						function ($scope, $rootScope, $state) {
							var vm = this;
							// Meta tags
							vm.desc = 'The privacy policy for the NewVote platform.';
							// Title
							vm.titleText = '';
							vm.titleText = 'Privacy Policy';
							$rootScope.headerTitle = 'Privacy Policy';
							vm.title = $rootScope.titlePrefix + vm.titleText + $rootScope.titleSuffix;
						}
					]
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
