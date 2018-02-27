'use strict';

angular.module('users.admin')
	.controller('UserListController', ['$scope', '$rootScope', '$filter', 'Admin', '$mdToast',
		function ($scope, $rootScope, $filter, Admin, $mdToast) {
			Admin.query(function (data) {
				$scope.users = data;
				$scope.buildPager();
			});

			$scope.checked = [];
			$scope.selected = [];

			// Update title
			$scope.title = $rootScope.titlePrefix + 'Admin | Users' + $rootScope.titleSuffix;
			$rootScope.headerTitle = 'Admin | Users';

			$scope.buildPager = function () {
				$scope.pagedItems = [];
				$scope.itemsPerPage = 15;
				$scope.currentPage = 1;
				$scope.figureOutItemsToDisplay();
			};

			$scope.figureOutItemsToDisplay = function () {
				$scope.filteredItems = $filter('filter')($scope.users, {
					$: $scope.search
				});
				$scope.filterLength = $scope.filteredItems.length;
				var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
				var end = begin + $scope.itemsPerPage;
				$scope.pagedItems = $scope.filteredItems.slice(begin, end);
			};

			$scope.isAdmin = function (user) {
				if (user.roles.indexOf('admin') != -1) {
					return true;
				} else {
					return false;
				}
			};

			$scope.isEndorser = function (user) {
				if (user.roles.indexOf('endorser') != -1) {
					return true;
				} else {
					return false;
				}
			};

			var updateUser = function (user) {
				user.$update()
					.then(function (user) {
						console.log('user updated');
						$mdToast.show(
							$mdToast.simple()
							.textContent('User updated')
							.position('bottom center')
							.hideDelay(3000)
						);
					}, function (err) {
						$mdToast.show(
							$mdToast.simple()
							.textContent('There was a problem updating the user account')
							.position('bottom center')
							.hideDelay(3000)
						);
					});
			};

			$scope.setAdmin = function (user) {
				if ($scope.checked[user._id] && user.roles.indexOf('admin') == -1) {
					console.log('added new role');
					user.roles.push('admin');
					updateUser(user);
				} else if (!$scope.checked[user._id] && user.roles.indexOf('admin') != -1) {
					console.log('removed admin role');
					user.roles = user.roles.filter(function (role) { return role != 'admin'; });
					updateUser(user);
				}
			};

			$scope.setEndorser = function (user) {
				if ($scope.selected[user._id] && user.roles.indexOf('endorser') == -1) {
					console.log('added endorser role');
					user.roles.push('endorser');
					updateUser(user);
				} else if (!$scope.selected[user._id] && user.roles.indexOf('endorser') != -1) {
					console.log('removed endorser role');
					user.roles = user.roles.filter(function (role) { return role != 'endorser'; });
					updateUser(user);
				}
			};

			$scope.pageChanged = function () {
				$scope.figureOutItemsToDisplay();
			};
		}
	]);
