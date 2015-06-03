'use strict';

/**
 * @ngdoc function
 * @name cCheckApp.controller:SessionsCtrl
 * @description
 * # SessionsCtrl
 * Controller of the cCheckApp
 */
angular.module('cCheckApp')
  .controller('SessionsCtrl', ['$scope', 'fighters', '$q', function ($scope, fighters, $q) {
    $scope.statuses = [	{status: 'Allir', filter: ''}, 
    					{status: 'Nýliðar', filter: 'Nýliði'}, 
    					{status: 'Bardagamenn', filter: 'Bardagamaður'}, 
    					{status: 'Þjálfarar', filter: 'Þjálfari'}
						];    
    $scope.dt = new Date();
    $scope.format = 'dd.MM.yyyy';
    $scope.fighters = fighters.query();

    $q.all([$scope.fighters.$promise]).then(function() {
    	$scope.fighters.forEach(function(fighter) {
    		fighter.attendance = null;
    	})
    })

	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};
	$scope.registerSession = function()	{
		console.log($scope.fighters);
	}
  }]);