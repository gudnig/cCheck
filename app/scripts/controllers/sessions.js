'use strict';

/**
 * @ngdoc function
 * @name cCheckApp.controller:SessionsCtrl
 * @description
 * # SessionsCtrl
 * Controller of the cCheckApp
 */
angular.module('cCheckApp')
  .controller('SessionsCtrl', ['$scope', 'fighters', 'sessions', '$q', function ($scope, fighters, sessions, $q) {
    $scope.statuses = [	{status: 'Allir', filter: ''}, 
    					{status: 'Nýliðar', filter: 'Nýliði'}, 
    					{status: 'Bardagamenn', filter: 'Bardagamaður'}, 
    					{status: 'Þjálfarar', filter: 'Þjálfari'}
						];
	$scope.format = 'dd.MM.yyyy';
    $scope.fighters = fighters.query();
    $scope.alerts = []
    $scope.load = false
    $scope.dt = new Date();

	 $scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
	  };    


    $q.all([$scope.fighters.$promise]).then(function() {
    	$scope.fighters.forEach(function(fighter) {
    		fighter.attendance = null;
    	});
    });

	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};

	/*** ADDSESSION ***/

	$scope.session = {};
	$scope.session.description = '';
    
    $scope.session.half_attendance = [];
    $scope.session.full_attendance = [];

	$scope.registerSession = function()	{	
		$scope.alerts = []			
		// prepare data
		$scope.session.date = $scope.dt.toJSON().slice(0, 10);	
		$scope.fighters.forEach(function(fighter) {
			if(fighter.attendance === 'full') {
				$scope.session.full_attendance.push(fighter.id)
			}
			else if(fighter.attendance === 'half') {
				$scope.session.half_attendance.push(fighter.id)
			}
		});		
		// save to api
		var result = sessions.save($scope.session)
		$scope.load = true;
		result.$promise.then(
			//success
			function(response) {
				// reset data
				$scope.session = {};
				$scope.session.description = '';
			    
			    $scope.session.half_attendance = [];
			    $scope.session.full_attendance = [];
			    // show success
				$scope.alerts.push({ type: 'success', 
									 msg: 'Mæting fyrir ' + 
									 	   response.date + 
									 	   ' hefur verið skráð. Fjöldi: ' + 
									 	   (response.full_attendance.length + response.half_attendance.length)  });
				$scope.load = false;
			},
			//error
			function(response){
				console.log(response.data);				
				$scope.alerts.push({ type: 'danger', msg: 'Villa kom upp, athugaðu villuskilaboðin og reyndu aftur: ' + JSON.stringify(response.data)});
				$scope.load = false;
			}
		)
	};
  }]);


