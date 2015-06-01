'use strict';

/**
 * @ngdoc function
 * @name cCheckApp.controller:SessionsCtrl
 * @description
 * # SessionsCtrl
 * Controller of the cCheckApp
 */
angular.module('cCheckApp')
  .controller('SessionsCtrl', ['$scope', 'fighters', function ($scope, fighters) {
    $scope.statuses = ['Nýliði', 'Bardagamaður', 'Þjálfari'];
    $scope.dt = new Date();


	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};
  
	$scope.format = 'dd.MM.yyyy';
  }]);
