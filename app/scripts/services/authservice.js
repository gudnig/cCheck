'use strict';

/**
 * @ngdoc service
 * @name cCheckApp.authService
 * @description
 * # authService
 * Factory in the cCheckApp.
 */
angular.module('cCheckApp')
  .factory('authService', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
