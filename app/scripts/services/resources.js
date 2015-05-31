'use strict';

/**
 * @ngdoc service
 * @name cCheckApp.resources
 * @description
 * # resources
 * Factory in the cCheckApp.
 */
angular.module('cCheckApp')
  .factory('resources', ['$resource', 'API_URL', function ($resource, API_URL) {
    return {
      fighters: function () {
        return $resource(API_URL + 'fighters/:id');
      }
    };
  }]);
