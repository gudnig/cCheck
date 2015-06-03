'use strict';

/**
 * @ngdoc function
 * @name cCheckApp.controller:FightersCtrl
 * @description
 * # FightersCtrl
 * Controller of the cCheckApp
 */
angular.module('cCheckApp')
  .controller('FightersCtrl', ['$scope', 'fighters', function ($scope, fighters) {
	$scope.statuses = ['Nýliði', 'Bardagamaður', 'Þjálfari'];

	/*** ADD NEW FIGHTER ***/
	$scope.newFighter = {};
	$scope.newFighter.status = 'Nýliði';
	$scope.newFighter.name = '';
	//$scope.addUser = false; // Use when create fighter and user together
	$scope.newFighter.user = null;

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};


	$scope.addFighter = function() {
		fighters.save($scope.newFighter);
	};
	/*** ADD NEW FIGHTER ***/

	/*var entries = resources.fighters().query(function() {
		console.log(entries);
	}); //query() returns all the entries*/
}]);
