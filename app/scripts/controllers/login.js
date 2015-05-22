'use strict';

/**
 * @ngdoc function
 * @name cCheckApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the cCheckApp
 */
angular.module('cCheckApp')
  .controller('LoginCtrl',['$scope', 'authService', function ($scope, authService) {
  	$scope.user = "";
  	$scope.pass = "";
    $scope.login = function () {
    	authService.login($scope.user, $scope.pass)
    };
  }]);
