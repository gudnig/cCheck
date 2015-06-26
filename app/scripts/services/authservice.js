'use strict';

/**
 * @ngdoc service
 * @name cCheckApp.authService
 * @description
 * # authService
 * Factory in the cCheckApp.
 */
angular.module('cCheckApp')
  .factory('authService', ['$http', '$q', '$window', 'API_URL', function ($http, $q, $window, API_URL) {
    // Service logic
    var user;   
    var isLoggedIn = false;


    function getUser() {      
      return user;      
    }

    function login(username, pass) {
      var deferred = $q.defer();

      $http.post(API_URL + 'api-token-auth/', {
        username: username, 
        password: pass
      }).then(
        // success
        function(response){        
          user =  response.data;

          // store user in case of refresh or somesuch
          $window.sessionStorage.setItem('user', JSON.stringify(user));        
          
          isLoggedIn = true;
          
          deferred.resolve(user);
        }, 
        // error
        function(error) {
          deferred.reject(error);
        });
      return deferred.promise;
    }

    function logout() {
      $window.sessionStorage.user = null;
      user = null;
      isLoggedIn = false;      
    }

    function loggedIn() {
      return isLoggedIn;
    }

    function permissions() {      
      if(isLoggedIn) {
        return user.permissions;
      }
      return [];
    }

    function init() {      
      if ($window.sessionStorage.user) {        
        user = JSON.parse($window.sessionStorage.getItem('user'));
        if(user){                    
          isLoggedIn = true;
        }
      }
    }
    init();

    // Public API here
    return {
      login: login, getUser: getUser, logout: logout, loggedIn: loggedIn, permissions: permissions
    };
  }]);
