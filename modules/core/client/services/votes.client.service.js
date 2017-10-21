'use strict';

angular.module('core').service('VoteService', ['$resource', '$state', '$stateParams', '$q', '_', 'VOTE_TYPES',
  function ($resource, $state, $stateParams, $q, _, VOTE_TYPES) {
    var Vote = $resource('api/votes/:voteId', { voteId: '@_id' }, { update: { method: 'PUT' } });

    var svc = this;

    svc.createOrUpdate = function(voteObj) {
      var vote = new Vote(voteObj);
      return vote._id ? vote.$update() : vote.$save();
    };

    svc.vote = function(object, objectType, voteType) {

      if (object.votes) {
        var existingVote = object.votes.currentUser;
        var voteValue = VOTE_TYPES[voteType];
        if(existingVote) {
          voteValue = existingVote.voteValue===voteValue ? VOTE_TYPES.cancel : voteValue;
        }
        var vote = {
          object: object._id,
          objectType: objectType,
          voteValue: voteValue
        };
        object.votes.currentUser = vote;
  
        svc.createOrUpdate(vote).then(null, function(err) {
          console.log('Error saving vote', err);
          object.votes.currentUser = existingVote;
        });
      } else {
        $state.go('authentication.signin');
      }
    };
  }
]);
