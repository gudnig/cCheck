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
	 $scope.alerts = [];

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
		$scope.alerts = [];
		var result = fighters.save($scope.newFighter);
		$scope.load = true;
		result.$promise.then(
			//success
			function(response) {				
				$scope.alerts.push({ type: 'success', msg: $scope.newFighter.status + ' ' + response.name + ' hefur verið skráður'});
				$scope.load = false;
				$scope.newFighter = {};
				$scope.newFighter.status = 'Nýliði';
			},
			//error
			function(response){
				console.log(response.data);				
				$scope.alerts.push({ type: 'danger', msg: 'Villa kom upp, athugaðu villuskilaboðin og reyndu aftur: ' + JSON.stringify(response.data)});
				$scope.load = false;
			}
		);
		
	};
	/*** ADD NEW FIGHTER ENDS ***/
}]).controller('FightersCtrl', ['$scope', 'fighters', '$q', function ($scope, fighters, $q) {
	$scope.fighters = fighters.query();
    $scope.alerts = [];    
    $scope.statuses = ['Nýliði', 'Bardagamaður', 'Þjálfari'];
    $scope.oldFighter = {};

    // Give fighters editable property
    $q.all([$scope.fighters.$promise]).then(function() {
        $scope.fighters.forEach(function(fighter) {
            fighter.editable = false;
        });
    });

    $scope.filterStatus = [ {status: 'Allir', filter: ''}, 
                        {status: 'Nýliðar', filter: 'Nýliði'}, 
                        {status: 'Bardagamenn', filter: 'Bardagamaður'}, 
                        {status: 'Þjálfarar', filter: 'Þjálfari'}
                        ];
     $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };    

      // Start edit, makes fighter editable and saves old info
      $scope.edit = function (fighter) {
  		fighter.editable = true;
		$scope.oldFighter = JSON.parse(JSON.stringify(fighter))
      };

      // Saves edits made to api, updates info, makes fighter uneditable 
      $scope.save = function (fighter) {
      	fighter.editable = false;
      };

      // Cancels edit, restores old info
      $scope.cancel = function (fighter) {
      	fighter.name = $scope.oldFighter.name;
      	fighter.status = $scope.oldFighter.status;
      	//console.log($scope.oldFighter);      	      	
      	fighter.editable = false;      	
      };
}]);
