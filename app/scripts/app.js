'use strict';

/**
 * @ngdoc overview
 * @name cCheckApp
 * @description
 * # cCheckApp
 *
 * Main module of the application.
 */
angular
  .module('cCheckApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
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
      .otherwise({
        redirectTo: '/login'
      });
      /*
      // Html 5 mode, need to fix rewrites to use
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
      */
  }])
  .constant('API_URL', 'http://localhost:8000/')
  .run(['$rootScope', '$location', 'authService', function($rootScope, $location, authService) {
    // Route changes settings for authentication

    // routes that don't require authentication
    var skipAuth = ['/login', '/about'];
    // routes only for trainers
    var trainersOnly = [];

    // check if route exists in array
    function existsIn(route, array) {
      var result = false;
      array.forEach(function(entry) {                
        if(entry.localeCompare(route) === 0) {          
          result = true;
        }
      });
      return result;
    }    
    $rootScope.$on('$routeChangeError', function(event, current, previous, eventObj) {
      if (eventObj.authenticated === false) {
        $location.path('/login');
      }
    });

    $rootScope.$on('$routeChangeStart', function () {
      var attemptRoute = $location.path();
      
      if(!existsIn(attemptRoute, skipAuth) && !authService.loggedIn())
      {        
        // if path requires authentication and user is not logged in
        $location.path('/login');
      }
      else if(existsIn(attemptRoute, trainersOnly) && authService.role() !== 'Þjálfari')
      {
        $location.path('/unauthorized');
      }
    });
  }])
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  })
  .controller('NavController', ['$scope', '$location', 'authService', '$window', function($scope, $location, authService, $window) {
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
    $scope.isTrainer = function() {      
      if(authService.loggedIn()) {        
        return authService.role() === 'Þjálfari';
      }
      return false;      
    }    
    console.log($scope.isTrainer());
  }]);
