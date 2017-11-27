'use strict';

angular.module('core').controller('IssuesController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', 'issues', 'GoalService', 'SortService',
	function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, issues, GoalService, SortService) {
		// This provides Authentication context.
		var vm = this;
		vm.issues = issues;
		vm.sortSvc = SortService;

		// Title
		vm.title = $rootScope.titlePrefix + 'Issues' + $rootScope.titleSuffix;
		$rootScope.headerTitle = 'Issues';

		// Meta tags
		vm.desc = 'A collection of the current issues being discussed on the NewVote platform.';
		vm.image = vm.issues[0] ? vm.issues[0].imageUrl : null;

		// vm.filterTags = [];
		//
		// var tagPromise = issues.map(function (issue) {
		// 	return GoalService.list({issueId: issue._id}).then(function (goals) {
		// 		var tags = [];
		// 		goals.map(function (goal) {
		// 			// console.log(goal.tags);
		// 			return goal.tags.map(function (tag) {
		// 				tags.push({name: tag});
		// 			});
		// 		});
		// 		return tags;
		// 	});
		// });
		//
		// Promise.all(tagPromise).then(function (results) {
		// 	console.log(results);
		//     var merged = [].concat.apply([], results);
		// 	vm.allTags = merged;
		//     addIssueTags();
		// });
		//
		// function addIssueTags(){
		//     issues.map(function(issue) {
		//         issue.tags.map(function(tag) {
		//             vm.allTags.push({name: tag});
		//         });
		//     });
		// }
		//
		// vm.searchTags = function (criteria) {
		//     console.log('searching for: ', criteria);
		// 	return criteria ? vm.allTags.filter(function(tag){
		//         return (tag.name.indexOf(angular.lowercase(criteria)) !== -1);
		//     }) : [];
		// };
		//
		// function createFilterFor(query) {
		// 	var lowercaseQuery = angular.lowercase(query);
		//
		// 	return function filterFn(tag) {
		// 		return (tag.indexOf(lowercaseQuery) !== -1);
		// 	};
		// }

		vm.sort = function (sortData, $event) {
			if ($event) $event.stopPropagation();
			SortService.setSort('issue', sortData.type, sortData.order);
		};
	}
]);
