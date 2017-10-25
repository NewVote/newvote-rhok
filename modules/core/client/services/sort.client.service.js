'use strict';

angular.module('core').service('SortService', ['$resource', '$stateParams', '$q', '_',
  function ($resource, $stateParams, $q, _) {

    var svc = this;
    svc.expression = '-votes.up';
    svc.reverse = false;

    var controversialSort = function(a){
        var votes = a.solutionMetaData ? a.solutionMetaData.votes : a.votes;
        // var aUp = votes.up===0 ? 1 : votes.up;
        // return (votes.down / aUp) * votes.total;
        var diff = Math.abs(votes.up - votes.down);
        diff = diff ? diff : 1;
        var sum = votes.up + votes.down;
        sum = sum ? sum : 1;
        var percentDiff = Math.pow((diff / sum), -1);
        var multiplier = 0.5;
        return percentDiff * (votes.total * multiplier);
    };

    var trendingSort = function(a) {
        var date = new Date(a.created);
        var today = new Date();
        var age = (today.getTime() - date.getTime()) / (1000 * 60 * 60);
        return a.votes.up/age;
    };

    var buildExpression = function(objectType, sortParam, order){
        svc.reverse = order === 'asc' ? false : true;

        if(objectType === 'solution' || objectType === 'action'){
            if(sortParam === 'top'){
                return 'votes.up';
            }else if(sortParam === 'controversial'){
                return controversialSort;
            }else if(sortParam === 'trending'){
                return trendingSort;
            }else if(sortParam === 'newest'){
                return 'created';
            }
        }
        else if(objectType === 'issue') {
            if(sortParam === 'alpha') {
                return 'name';
            }else if(sortParam === 'top'){
                return 'solutionMetaData.votes.up';
            }else if(sortParam === 'controversial'){
                return controversialSort;
            }else if(sortParam === 'trending'){
                return 'solutionMetaData.totalTrendingScore';
            }else if(sortParam === 'newest'){
                return 'solutionMetaData.lastCreated';
            }
        }
    };

    svc.setSort = function(objectType, sortParam, order) {
        svc.expression = buildExpression(objectType, sortParam, order);
    };
  }
]);
