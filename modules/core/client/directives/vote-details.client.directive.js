'use strict';

angular.module('core').directive('voteDetails', ['$timeout', function ($timeout) {
	return {
		restrict: 'E',
		scope: {
			object: '='
		},
		templateUrl: 'modules/core/client/views/vote-details.client.view.html',
		bindToController: true,
		controllerAs: 'vm',
		controller: ['$scope', 'Authentication', '$mdDialog',
			function ($scope, Authentication, $mdDialog) {
				var vm = this;
				vm.showDetails = false;

				vm.showAdvanced = function (ev) {
					$mdDialog.show({
							locals: {
								object: vm.object
							},
							controllerAs: 'vm',
							bindToController: true,
							controller: DialogController,
							templateUrl: 'modules/core/client/views/vote-details-dialog.client.view.html',
							parent: angular.element(document.body),
							targetEvent: ev,
							clickOutsideToClose: true,
							fullscreen: true // Only for -xs, -sm breakpoints.
						})
						.then(function (answer) {
							$scope.status = 'You said the information was "' + answer + '".';
						}, function () {
							$scope.status = 'You cancelled the dialog.';
						});
				};

				function DialogController($scope, $mdDialog, object) {
					var vm = this;
					vm.object = object;

					$scope.hide = function () {
						$mdDialog.hide();
					};

					$scope.cancel = function () {
						$mdDialog.cancel();
					};

					$scope.answer = function (answer) {
						$mdDialog.hide(answer);
					};

					vm.chartLabels = ['Against', 'For'];
					vm.chartOptions = {
						elements: {
							arc: {
								borderWidth: 0
							}
						},
						responsive: true,
						legend: {
							display: false
						}
					};

					vm.chartColors = [{
							backgroundColor: 'rgba(255,0,0,0.8)',
							pointBackgroundColor: 'rgba(255,0,0,0.5)',
							pointHoverBackgroundColor: 'rgba(255,0,0,0.6)',
							borderColor: 'rgba(255,0,0,0.6)',
							pointBorderColor: 'rgba(255,0,0,0.6)',
							pointHoverBorderColor: 'rgba(255,0,0,0.6)'
						},
						{
							backgroundColor: 'rgba(0,255,0,0.8)',
							pointBackgroundColor: 'rgba(0,255,0,0.5)',
							pointHoverBackgroundColor: 'rgba(77,83,96,1)',
							borderColor: 'rgba(77,83,96,1)',
							pointBorderColor: '#fff',
							pointHoverBorderColor: 'rgba(77,83,96,0.8)'
						}
					];
				}

				vm.chartLabels = ['Against', 'For'];
				vm.chartOptions = {
					elements: {
						arc: {
							borderWidth: 0
						}
					},
					responsive: true,
					legend: {
						display: false
					},
					events: []
				};

				vm.chartColors = [{
						backgroundColor: 'rgba(255,0,0,0.8)',
						pointBackgroundColor: 'rgba(255,0,0,0.5)',
						pointHoverBackgroundColor: 'rgba(255,0,0,0.6)',
						borderColor: 'rgba(255,0,0,0.6)',
						pointBorderColor: 'rgba(255,0,0,0.6)',
						pointHoverBorderColor: 'rgba(255,0,0,0.6)'
					},
					{
						backgroundColor: 'rgba(0,255,0,0.8)',
						pointBackgroundColor: 'rgba(0,255,0,0.5)',
						pointHoverBackgroundColor: 'rgba(77,83,96,1)',
						borderColor: 'rgba(77,83,96,1)',
						pointBorderColor: '#fff',
						pointHoverBorderColor: 'rgba(77,83,96,0.8)'
					}
				];
			}
		]
	};
}]);
