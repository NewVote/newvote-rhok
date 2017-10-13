'use strict';

angular.module('core').service('SortService', ['$resource', '$stateParams', '$q', '_',
  function ($resource, $stateParams, $q, _) {

    var svc = this;
    svc.expression = "-votes.up";
    svc.reverse = false;

    var controversialIssueSort = function(a){
        var aUp = a.solutionMetaData.votes.up===0 ? 1 : a.solutionMetaData.votes.up;
        return (a.solutionMetaData.votes.down / aUp) * a.solutionMetaData.votes.total;
    };

    var controversialSort = function(a){
        var votes = a.solutionMetaData ? a.solutionMetaData.votes : a.votes;
        var aUp = votes.up===0 ? 1 : votes.up;
        return (votes.down / aUp) * votes.total;
    };

    var trendingSort = function(a) {
        var date = new Date(a.created);
        var today = new Date();
        var age = (today.getTime() - date.getTime()) / (1000 * 60 * 60);
        return a.votes.up/age;
    };

    var buildExpression = function(objectType, sortParam, order){
        svc.reverse = order === "asc" ? false : true;

        if(objectType === "solution" || objectType === "action"){
            if(sortParam === "top"){
                return "votes.up";
            }else if(sortParam === "controversial"){
                return controversialSort;
            }else if(sortParam === "trending"){
                return trendingSort;
            }else if(sortParam === "newest"){
                return "created";
            }
        }
        else if(objectType === "issue") {
            if(sortParam === "alpha") {
                return "name";
            }else if(sortParam === "top"){
                return "solutionMetaData.votes.up";
            }else if(sortParam === "controversial"){
                return controversialSort;
            }else if(sortParam === "trending"){
                return "solutionMetaData.totalTrendingScore";
            }else if(sortParam === "newest"){
                return "solutionMetaData.lastCreated";
            }
        }
    };

    svc.setSort = function(objectType, sortParam, order) {
        svc.expression = buildExpression(objectType, sortParam, order);
    };
  }
]);
