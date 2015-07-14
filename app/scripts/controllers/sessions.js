'use strict';

/**
 * @ngdoc function
 * @name cCheckApp.controller:SessionsCtrl
 * @description
 * # SessionsCtrl
 * Controller of the cCheckApp
 */
angular.module('cCheckApp')
  .controller('AddSessionCtrl', ['$scope', 'fighters', 'sessions', '$q', function ($scope, fighters, sessions, $q) {
    
    $scope.types = ['Bardagaæfing', 'Bogaæfing'];
    $scope.format = 'dd.MM.yyyy';
    $scope.fighters = fighters.query();
    $scope.alerts = [];
    $scope.load = false;
    $scope.dt = new Date();
    $scope.traineeType = 0;

    // Statuses for filtering
    $scope.statuses = [ {name: 'Allir', value: 0}, 
                        {name: 'Nýliðar', value: 1}, 
                        {name: 'Bardagamenn', value: 2}, 
                        {name: 'Bogamenn', value: 3},
                        {name: 'Þjálfarar', value: 4}
                        ];

    // Function for finding predicate for filter based on status
    $scope.traineeFilter = function(type) {
        if(type === 1) {
            return function(item) {
                return item.is_newbie;
            };
        }
        else if(type === 2) {
        return function(item) {
                return item.is_fighter;
            };}
        else if(type === 3) {
        return function(item) {
                return item.is_archer;
            };} 
        else if(type === 4) {
            return function(item) {
                return item.is_trainer;
            };
        }
        else {}
    }


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
    $scope.session.session_type = 'Bardagaæfing';
    $scope.session.half_attendance = [];
    $scope.session.full_attendance = [];

    $scope.registerSession = function() {   
        $scope.alerts = []; 
        // prepare data
        $scope.session.date = $scope.dt.toJSON().slice(0, 10);  
        $scope.fighters.forEach(function(fighter) {
            if(fighter.attendance === 'full') {
                $scope.session.full_attendance.push(fighter.id);
            }
            else if(fighter.attendance === 'half') {
                $scope.session.half_attendance.push(fighter.id);
            }
        });     
        // save to api
        var result = sessions.save($scope.session);
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
        );
    };
}]).controller('AllSessionsCtrl', ['$scope', 'fighters', 'sessions', '$q', function ($scope, fighters, sessions, $q) {
    
    $scope.format = 'dd.MM.yyyy';
    $scope.types = [ {type: 'Bogaæfingar', param: 'Bogaæfing'}, 
                     {type: 'Bardagaæfingar', param: 'Bardagaæfing'} ];
    $scope.current_type = "Bardagaæfing";

    // set up starting date filter
    var today = new Date();
    var month = today.getMonth() + 1;
    var start_year = today.getFullYear();
    if(month < 9)
    {
        start_year--;
    }
    var end_year = start_year + 1;

    $scope.from_date = new Date(start_year, 8, 1);
    $scope.to_date = new Date(end_year, 7, 31);    


    $scope.open_from = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened_from = true;
    };

    $scope.open_to = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened_to = true;
    };

    $scope.sessions = [];
    $scope.fighters = [];

    $scope.filterSessions = function() {
        $scope.sessions = sessions.query({type: $scope.current_type, from: $scope.from_date.toJSON().slice(0, 10), to: $scope.to_date.toJSON().slice(0, 10) });
        $scope.fighters = fighters.query(); 
        $q.all([$scope.sessions.$promise, $scope.fighters.$promise]).then(function() {
            // sort out total attendance, could probably use a better algorithm or do this in the API
            // TODO: move this functionality to the api, possibly do a join of some sort
            $scope.fighters.forEach(function(fighter) {
                fighter.total = 0.0;
                $scope.sessions.forEach(function(session) {
                    var result = $.grep(session.full_attendance, function(entry) {
                        return entry === fighter.id;
                    });
                    if(result.length === 0) {
                        // not full attendance
                        if($.grep(session.half_attendance, function(entry) {
                            return entry === fighter.id;
                        }).length === 1) {
                            // half attendance
                            fighter.total += 0.5;
                        }                    
                    }
                    else if(result.length === 1) {                        
                        fighter.total += 1.0;
                    }
                });
            });
        },
        // error handler, empty atm
        function() {}
    );};
    
    
}]);


