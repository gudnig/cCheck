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
      }).then(function(response){     
        user = {};
        user.token = response.data.token;
        user.name = response.data.name;
        user.status = response.data.status;
        $window.sessionStorage.user = JSON.stringify(user);

        isLoggedIn = true;

        //console.log($window.sessionStorage.user); 
        deferred.resolve(user);
      }, 
      function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function logout() {
      $window.sessionStorage.user = null;
      user = null;
      isLoggedIn = false;
      return;
    }

    function loggedIn() {
      return isLoggedIn;
    }

    function role() {
      if(user) {
        return user.status;
      }
      return 'guest';
    }

    function init() {      
      if ($window.sessionStorage.user !== null) {
          user = JSON.parse($window.sessionStorage.user);
          if( user !== null) {
            isLoggedIn = true;
          }          
      }
    }
    init();

    // Public API here
    return {
      login: login, getUser: getUser, logout: logout, loggedIn: loggedIn, role: role
    };
  }]);
