'use strict';

angular.module('core').controller('IssuesController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', 'issues', 'SolutionService', 'SortService',
	function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, issues, SolutionService, SortService) {
		// This provides Authentication context.
		var vm = this;
		vm.issues = issues;
		vm.sortSvc = SortService;

		// Title
		vm.title = 'Issues';
		$rootScope.pageTitle = vm.title;

		// Meta tags
		vm.desc = 'A list of issues';
		vm.image = vm.issues[0].imageUrl;

        // vm.filterTags = [];
        //
		// var tagPromise = issues.map(function (issue) {
		// 	return SolutionService.list({issueId: issue._id}).then(function (solutions) {
		// 		var tags = [];
		// 		solutions.map(function (solution) {
		// 			// console.log(solution.tags);
		// 			return solution.tags.map(function (tag) {
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
        //     console.log("searching for: ", criteria);
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
			SortService.setSort("issue", sortData.type, sortData.order);
		};
	}
]);
