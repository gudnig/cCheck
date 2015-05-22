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
    function login(user, pass) {
      var deferred = $q.defer();

      $http.post(API_URL + 'api-token-auth/', {username: user, password: pass}).then(function(response){
        console.log(response);
      });
    }

    // Public API here
    return {
      login: login
    };
  }]);
