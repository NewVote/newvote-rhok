'use strict';

angular.module('core').controller('IssueController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', '$stateParams', 'IssueService', '$mdDialog', 'issue', 'VoteService', 'solutions', 'UploadService', '$q', 'SortService', 'SocialshareService', '$mdConstant',
  function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, $stateParams, IssueService, $mdDialog, issue, VoteService, solutions, UploadService, $q, SortService, SocialshareService, $mdConstant) {
    // This provides Authentication context.
    var vm = this;
    vm.issue = issue;
    vm.issueId = issue._id;
    vm.solutions = solutions;

		// Meta tags
    vm.desc = $rootScope.removeHtmlElements(vm.issue.description);
    vm.image = vm.issue.imageUrl;

    // Title
    vm.title = '';
    if (vm.issue._id && $state.is('issues.edit')) {
      vm.title = 'Edit Issue - ' + vm.issue.name;
    } else if ($state.is('issues.create')) {
      vm.title = 'Add a Issue';
    } else if ($state.is('issues.view')) {
      vm.title = vm.issue.name;
    }

    $rootScope.pageTitle = vm.title;


		$scope.authentication = Authentication;
		$scope.prerender = document.getElementById("prerender");

    vm.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.SPACE];

    vm.share = function(provider) {
      SocialshareService.share({
        provider: provider,
        rel_url: '/issues/' + vm.issue._id,
        title: vm.issue.name,
        hashtags: vm.issue.tags.join()
      });
    };

    vm.createOrUpdate = function() {
      var promise = $q.resolve();
      if(vm.imageFile) {
        promise = UploadService.upload(vm.imageFile).then(function() {
          console.log('uploaded file', vm.imageFile);
          vm.issue.imageUrl = vm.imageFile.result.url;
        });
      }
      return promise.then(function() {
        return IssueService.createOrUpdate(vm.issue).then(function(issue) {
          $state.go('issues.view', { issueId: issue._id });
        });
      });
    };

		vm.delete = function () {
			if (!vm.issue._id) return;
			var confirm = $mdDialog.confirm()
				.title('Are you sure you want to delete this issue?')
				.textContent('This cannot be undone. Please confirm your decision')
				.ok('Yes, I\'m sure')
				.cancel('No');

			$mdDialog.show(confirm).then(function () {
				IssueService.delete(vm.issue._id).then(function () {
					$state.go('issues.list');
				});
			});
		};

		vm.vote = function (solution, voteType, $event) {
			$event.stopPropagation();
			VoteService.vote(solution, 'Solution', voteType);
		};

		angular.element(document).find('script[src="https://pol.is/embed.js"]').remove();
		var el = angular.element('<script>').attr('src', 'https://pol.is/embed.js');
		angular.element(document).find('body').append(el);
	}
]);
