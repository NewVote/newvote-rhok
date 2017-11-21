'use strict';

angular.module('core').directive('shareButtons', ['$timeout', function ($timeout) {
  return {
		restrict: 'E',
		scope: {
      object: '=',
      reqObject: '=',
      objectType: '=',
      verticalResize: '='
		},
		templateUrl: 'modules/core/client/views/share-buttons.client.view.html',
		bindToController: true,
		controllerAs: 'vm',
		controller: ['$scope', '$window', '$state', 'SocialshareService', 'GoalService',
			function ($scope, $window, $state, SocialshareService, GoalService) {
        var vm = this;

        vm.shareItems = [
          { name: 'Facebook', id: 'facebook', imageName: 'facebook.svg' },
          { name: 'Twitter', id: 'twitter', imageName: 'twitter.svg' },
          { name: 'Google+', id: 'google_plus', imageName: 'google-plus.svg' },
          { name: 'LinkedIn', id: 'linkedin', imageName: 'linkedin.svg' },
          { name: 'Reddit', id: 'reddit', imageName: 'reddit.svg' }
        ];

        vm.$onInit = function () {
          if (vm.verticalResize) {
            vm.windowWidth = $window.innerWidth;
            angular.element($window).on('resize', function() {
              vm.windowWidth = $window.innerWidth;
            });
          }
        };

        vm.$onDestroy = function () {
          angular.element($window).off('resize');
        };


        vm.share = function (provider) {

          switch (vm.objectType) {

            case 'goal':
              SocialshareService.share({
                provider: provider,
                rel_url: '/goals/' + vm.object._id,
                title: vm.object.title,
                hashtags: vm.object.tags.join()
              });
              break;

            case 'issue':
              SocialshareService.share({
                provider: provider,
                rel_url: '/issues/' + vm.object._id,
                title: vm.object.name,
                hashtags: vm.object.tags.join()
              });
              break;

            case 'media':
              SocialshareService.share({
                provider: provider,
                rel_url: '/media/' + vm.object._id,
                title: vm.object.title,
                hashtags: vm.object.tags.join()
              });
              break;

            case 'solution':
              SocialshareService.share({
                provider: provider,
                rel_url: '/goals/' + vm.reqObject._id + '/?solutionId=' + vm.object._id,
                title: vm.object.title,
                hashtags: vm.reqObject.tags.join()
              });
              break;

            default:
              console.log('Unknown object type', vm.objectType);
              break;

          }
        };
			}
		]
	};
}]);
