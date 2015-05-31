'use strict';

/**
 * @ngdoc function
 * @name cCheckApp.controller:AddtraineeCtrl
 * @description
 * # AddtraineeCtrl
 * Controller of the cCheckApp
 */
angular.module('cCheckApp')
  .controller('AddtraineeCtrl',['$scope', 'resources', function ($scope, resources) {    
    var entries = resources.fighters().query(function() {
    	console.log(entries);
  	}); //query() returns all the entries
  }]);
