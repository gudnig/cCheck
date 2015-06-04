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
	 $scope.alerts = []

	 $scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
	  };

	/*** ADD NEW FIGHTER ***/
	$scope.newFighter = {};
	$scope.newFighter.status = 'Nýliði';
	$scope.newFighter.name = '';
	$scope.load = false;
	//$scope.addUser = false; // Use when create fighter and user together
	$scope.newFighter.user = null;

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};


	$scope.addFighter = function() {
		$scope.alerts = []
		var result = fighters.save($scope.newFighter);
		$scope.load = true;
		result.$promise.then(
			//success
			function(response) {

				$scope.newFighter = {};
				$scope.newFighter.status = 'Nýliði';
				$scope.alerts.push({ type: 'success', msg: "Bardagamaður: " + response.name + " hefur verið skráður"});
				$scope.load = false;
			},
			//error
			function(response){
				console.log(response.data);				
				$scope.alerts.push({ type: 'danger', msg: "Villa kom upp, athugaðu villuskilaboðin og reyndu aftur: " + JSON.stringify(response.data)});
				$scope.load = false;
			}
			)
		
	};
	/*** ADD NEW FIGHTER ***/

	/*var entries = resources.fighters().query(function() {
		console.log(entries);
	}); //query() returns all the entries*/
}]);
