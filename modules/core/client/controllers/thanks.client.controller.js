'use strict';

angular.module('core').controller('ThanksController', ['$scope', '$rootScope', '$state',
	function ($scope, $rootScope, $state) {
    // Update Title
    $scope.title = $rootScope.titlePrefix + 'Thank You' + $rootScope.titleSuffix;
    $scope.desc = 'Our team of curators are busy going through all of th' +
    'e great suggestions from our community, and will get to yours as soon a' +
    's they can!';
    $rootScope.headerTitle = 'Thank You';
	}
]);
