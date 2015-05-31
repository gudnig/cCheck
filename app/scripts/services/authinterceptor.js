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
        if ($window.sessionStorage.user) {
          if($window.sessionStorage.user.token !== undefined) {
            config.headers.Authorization =  'Token ' + $window.sessionStorage.user.token;
          }
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