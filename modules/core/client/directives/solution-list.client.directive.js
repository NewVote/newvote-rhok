'use strict';

angular.module('core')

.directive('solutionList', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      solutions: '=',
      issueId: '=',
      sortParam: '='
    },
    templateUrl: 'modules/core/client/views/solutions-list.client.view.html',
    bindToController: true,
    controllerAs: 'vm',
    controller: ['$scope', 'VoteService',
      function ($scope, VoteService) {
        var vm = this;
        vm.vote = function(solution, voteType, $event) {
          $event.stopPropagation();
          VoteService.vote(solution, 'Solution', voteType);
        };
      }
    ]
  };
}]);
