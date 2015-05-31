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
    var name = "", status = "", token = "";    
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
        $window.sessionStorage.status = response.data.status;
        $window.sessionStorage.name = response.data.name;
        $window.sessionStorage.token = response.data.token;
        isLoggedIn = true;

        //console.log($window.sessionStorage.user); 
        deferred.resolve(token);
      }, 
      function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function logout() {
      $window.sessionStorage.token = null;
      $window.sessionStorage.status = null;
      $window.sessionStorage.name = null;
      user = null;
      isLoggedIn = false;
      return;
    }

    function loggedIn() {
      return isLoggedIn;
    }

    function role() {
      if(status !== "") {
        return status;
      }
      return 'guest';
    }

    function init() {      
      if ($window.sessionStorage.token != null) {
          token = $window.sessionStorage.token;
          if( token !== null) {
            isLoggedIn = true;
          }          
      }
      if ($window.sessionStorage.status != null) {
          status = $window.sessionStorage.status;      
      }
      if ($window.sessionStorage.name != null) {
          name = $window.sessionStorage.name;                    
      }
    }
    init();

    // Public API here
    return {
      login: login, getUser: getUser, logout: logout, loggedIn: loggedIn, role: role
    };
  }]);
