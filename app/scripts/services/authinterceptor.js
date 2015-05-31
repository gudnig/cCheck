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
        console.log($window.sessionStorage.token);
        config.headers = config.headers || {};
        if($window.sessionStorage.token)
          config.headers.Authorization =  'Token ' + $window.sessionStorage.token;
        
        
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