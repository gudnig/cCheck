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
  .config(function ($routeProvider) {
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
      .otherwise({
        redirectTo: '/login'
      });
  }).constant('API_URL', 'http://localhost:8000/');
