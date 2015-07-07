'use strict';

/**
 * @ngdoc overview
 * @name cCheckApp
 * @description
 * # cCheckApp
 *
 * Main module of the application.
 */

// Helper function
// check if item exists in array
  function existsIn(item, array) {
    var result = false;
    array.forEach(function(entry) {                
      if(entry.localeCompare(item) === 0) {          
        result = true;
      }
    });
      return result;
  }   

angular
  .module('cCheckApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'        
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/unauthorized', {
        templateUrl: 'views/unauthorized.html'        
      })
      .when('/addTrainee', {
        templateUrl: 'views/addtrainee.html',
        controller: 'AddFightersCtrl'
      })
      .when('/allTrainees', {
        templateUrl: 'views/allfighters.html',
        controller: 'AllFightersCtrl'
      })
      .when('/addSession', {
        templateUrl: 'views/addsession.html',
        controller: 'AddSessionCtrl'
      })
      .when('/allSessions', {
        templateUrl: 'views/allsessions.html',
        controller: 'AllSessionsCtrl'
      })
      .otherwise({
        redirectTo: '/about'
      });
      
      // Html 5 mode, need to fix rewrites to use 
      /*
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });*/
      
  }])
  .constant('API_URL', 'http://localhost:8000/') // http://localhost:8000/ https://ccheckapi.herokuapp.com/
  .run(['$rootScope', '$location', 'authService', function($rootScope, $location, authService) {
    // Route changes settings for authentication

    // routes that don't require authentication
    var skipAuth = ['/', '/login', '/about'];
    // routes only for trainers
    var trainersOnly = ['/addTrainee', '/allTrainees', '/addSession', '/allSessions' ];

     
    $rootScope.$on('$routeChangeError', function(event, current, previous, eventObj) {
      if (eventObj.authenticated === false) {
        $location.path('/login');
      }
    });

    $rootScope.$on('$routeChangeStart', function () {
      var attemptedRoute = $location.path();      
      if(!existsIn(attemptedRoute, skipAuth) && !authService.loggedIn())
      {        
        // if path requires authentication and user is not logged in
        $location.path('/login');
      }
      else if(existsIn(attemptedRoute, trainersOnly) && !existsIn('trainer', authService.permissions()))
      {
        //
        $location.path('/unauthorized');
      }
    });
  }])
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  })
  .config(function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
  })
  .config(function (datepickerConfig) {
      datepickerConfig.showButtonBar = false;
    })
  .controller('NavController', ['$scope', '$location', 'authService', function($scope, $location, authService) {
    $scope.isActive = function(viewLocation) {
      return viewLocation === $location.path();
    };
    $scope.logout = function() { 
      authService.logout(); 
      $location.path('/login');
    };
    $scope.loggedIn = function() {      
      if(authService.loggedIn()) {
        return true;
      }
      else {
        return false;
      }
    };

    $scope.user = authService.getUser();    
    $scope.isTrainer = function() {      
      return existsIn('trainer', authService.permissions());
    };
  }]);
