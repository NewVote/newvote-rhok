'use strict';

angular.module('core')
	.service('VoteService', ['$resource', '$state', '$stateParams', '$q', '_', 'VOTE_TYPES', '$localStorage', '$mdToast',
		function ($resource, $state, $stateParams, $q, _, VOTE_TYPES, $localStorage, $mdToast) {
			var Vote = $resource('api/votes/:voteId', {
				voteId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			});

			var svc = this;

			svc.createOrUpdate = function (voteObj) {
				var vote = new Vote(voteObj);
				return vote._id ? vote.$update() : vote.$save();
			};

			svc.vote = function (object, objectType, voteType) {
				if (object.votes) {
					var existingVote = object.votes.currentUser;
					var voteValue = VOTE_TYPES[voteType];
					if (existingVote) {
						voteValue = existingVote.voteValue === voteValue ? VOTE_TYPES.cancel : voteValue;
					}
					var vote = {
						object: object._id,
						objectType: objectType,
						voteValue: voteValue
					};
					object.votes.currentUser = vote;

					return svc.createOrUpdate(vote)
						.then(function (data) {
							svc.showSimpleToast();
							return data;
						}, function (err) {
							if (err.status === 401) {
								if (!$localStorage.pendingVotes) {
									$localStorage.pendingVotes = [];
								}
								$localStorage.pendingVotes.push({
									object: object,
									objectType: objectType,
									voteType: voteType
								});
							}
							object.votes.currentUser = existingVote;
						});
				} else {
					console.log('there was no .votes');
				}
			};

			svc.showSimpleToast = function () {
				$mdToast.show(
					$mdToast.simple()
					.textContent('Your vote has been recorded')
					.position('bottom center')
					.hideDelay(3000)
				);
			};
		}
	]);
