'use strict';

/**
 * @ngdoc service
 * @name cCheckApp.authInterceptor
 * @description
 * # authInterceptor
 * Factory in the cCheckApp.
 */
angular.module('cCheckApp')
  .factory('authInterceptor',['$rootScope', '$q', '$window', '$location', function ($rootScope, $q, $window, $location) {
    // Service logic
    return {
      request: function (config) {        
        config.headers = config.headers || {};        
        var user = JSON.parse(sessionStorage.getItem('user'));
        console.log(user);
        if(user) {          
          config.headers.Authorization =  'Token ' + user.Token;
        }        
        
        return config;
      },
      response: function (response) {
        if (response.status === 401) {
            $location.path('/login');
        }
        return response || $q.when(response);
      }
    };
  }]);