'use strict';

/**
 * @ngdoc function
 * @name cCheckApp.controller:FightersCtrl
 * @description
 * # FightersCtrl
 * Controller of the cCheckApp
 */
angular.module('cCheckApp')
  .controller('AddFightersCtrl', ['$scope', 'fighters', 'users', function ($scope, fighters, users) {
	$scope.statuses = ['Nýliði', 'Bardagamaður', 'Bogamaður', 'Þjálfari'];
	 $scope.alerts = [];

	




	/*** ADD NEW FIGHTER ***/
	$scope.newFighter = {};	
	$scope.newFighter.name = '';
	$scope.newFighter.is_newbie = true;
	$scope.newFighter.is_fighter = true;
	$scope.newFighter.is_archer = false;

	$scope.newUser = {};
	$scope.newUser.username = '';
	$scope.newUser.password = '1234';
	$scope.newUser.email = '';
	$scope.newUser.groups = []
	$scope.newUser.user_permissions = []
	
	$scope.load = false;
	$scope.checkAddUser = false; // Use when create fighter and user together
	$scope.newFighter.user = null;

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.addFighter = function() {
		$scope.load = true;
		$scope.alerts = [];
		if($scope.checkAddUser) {
			$scope.createUserAndFighter();
		}
		else {
			$scope.createFighter();
		}
	};

	$scope.createFighter = function(id) {		
		fighters.save($scope.newFighter).$promise.then(
			//success
			function(response) {				
				$scope.alerts.push({ type: 'success', msg: $scope.newFighter.status + ' ' + response.name + ' hefur verið skráður'});

				if($scope.checkAddUser) {
					$scope.newFighter.user = id;
				}

				$scope.load = false;				
				$scope.newFighter.status = 'Nýliði';
				$scope.newFighter.name = '';
				$scope.checkAddUser = false;
			},
			//error
			function(response){
				console.log(response.data);				
				$scope.alerts.push({ type: 'danger', msg: 'Villa kom upp, athugaðu villuskilaboðin og reyndu aftur: ' + JSON.stringify(response.data)});
				$scope.load = false;
			}
		);
		
	};

	$scope.createUserAndFighter = function() {						
		users.save($scope.newUser).$promise.then(
			//success
			function(response) {
				$scope.alerts.push({ type: 'success', msg: 'Nýr notandi búinn til, notandanafn: ' + response.username });
				$scope.createFighter(response.id);
				$scope.newUser.username = '';
				$scope.newUser.password = '1234';
				$scope.newUser.email = '';
				
			},
			//error
			function(){
				$scope.alerts.push({ type: 'danger', msg: 'Villa við að búa til notanda eða bardagamann' });
				$scope.load = false;
				
			}
		).finally(function() {

		});

	};
	/*** ADD NEW FIGHTER ENDS ***/
}]).controller('AllFightersCtrl', ['$scope', 'fighters', 'users', '$q', 'ngDialog', function ($scope, fighters, users, $q, ngDialog) {
	$scope.fighters = fighters.query();
    $scope.alerts = [];    
    $scope.statuses = ['Nýliði', 'Bardagamaður', 'Bogamaður', 'Þjálfari'];
    $scope.oldFighter = {};

    // Fetch fighters and give them editable property
    $q.all([$scope.fighters.$promise]).then(function() {
        $scope.fighters.forEach(function(fighter) {
            fighter.editable = false;
        });
    });

    $scope.editUser = function (fighter) {
    	$scope.editUserFighter = fighter;
    	if($scope.editUserFighter.user === null)
    	{
    		$scope.editUserFighter.createUser = true;
    	}
    	console.log($scope.editUserFighter);

    	// open popup to edit/create user
        ngDialog.open({ 
        	template: '/dialog/editUser.html',
        	scope: $scope,
        	controller: 'AllFightersCtrl'
    	});
    };

    $scope.saveUser = function () {

    	if($scope.editUserFighter.createUser)
    	{
    		$scope.createUser();
    	}
    	else
    	{
    		$scope.updateUser();
    	}
    	
    };

	$scope.updateUser = function() {
		users.edit($scope.editUserFighter.user).$promise.then(
			//success
			function(result) {
				$scope.editUserFighter.user = result.id;
				fighters.update($scope.editUserFighter).$promise.then(
					function(result) { $scope.editUserFighter = result; console.log(result); },
					function() {}	
				);
			},
			//error
			function(){
				// change did not occur so reset data
				$scope.reset_fighter($scope.editUserFighter);
			}
		);
	}

	$scope.createUser = function () {
		users.save($scope.editUserFighter.user).$promise.then(
			//success
			function(result) {
				$scope.editUserFighter.user = result.id;
				fighters.update($scope.editUserFighter).$promise.then(
					function(result) { $scope.editUserFighter = result; console.log(result); },
					function() {}	
				);
			},
			//error
			function(){
				// change did not occur so reset data
				$scope.reset_fighter(fighter);
			}
		);
	}
    

    $scope.reset_fighter = function(fighter)
    {
    	fighter.name = $scope.oldFighter.name;
    	fighter.user = $scope.oldFighter.user;
    	fighter.is_newbie = $scope.oldFighter.is_newbie;
    	fighter.is_archer = $scope.oldFighter.is_archer;
    	fighter.is_fighter = $scope.oldFighter.is_fighter;
    	fighter.is_trainer = $scope.oldFighter.is_trainer;
    	fighter.can_post_notifications = $scope.oldFighter.can_post_notifications;
    	fighter.editable = false;  
    }    

    $scope.filterStatus = [ {status: 'Allir', filter: ''}, 
                        {status: 'Nýliðar', filter: 'Nýliði'}, 
                        {status: 'Bardagamenn', filter: 'Bardagamaður'}, 
                        {status: 'Þjálfarar', filter: 'Þjálfari'}
                        ];     

      // Start edit, makes fighter editable and saves old info
      $scope.edit = function (fighter) {
  		fighter.editable = true;

  		// Save data in case of cancel
		$scope.oldFighter = JSON.parse(JSON.stringify(fighter));
      };

      // Saves edits made to api, updates info, makes fighter uneditable 
      $scope.save = function (fighter) {
      	if(fighter.user !== null) {
	      	$scope.saveUser = fighter.user;
	      	fighter.user = fighter.user.id;
		}
		else {
      		$scope.saveUser = null;
		}

      	fighters.update(fighter).$promise.then(
			//success
			function(result) {
				fighter = result;
				fighter.user = $scope.saveUser;
			},
			//error
			function(){
				// change did not occur so reset data
				$scope.reset_fighter(fighter);
			}
		);
      	fighter.editable = false;
      };

      // Cancels edit, restores old info
      $scope.cancel = function (fighter) {
      	
      	// Reset data      	
      	$scope.reset_fighter(fighter);
      	 	
      };      
}]);
