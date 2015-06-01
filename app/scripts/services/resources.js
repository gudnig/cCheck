'use strict';

/**
 * @ngdoc service
 * @name cCheckApp.resources
 * @description
 * # resources
 * Factory in the cCheckApp.
 */
angular.module('cCheckApp')
  .factory('fighters', ['$resource', 'API_URL', function ($resource, API_URL) {    
      return $resource(API_URL + 'fighters/:id');    
  }])
  .factory('users', ['$resource', 'API_URL', function ($resource, API_URL) {    
      return $resource(API_URL + 'users/:id');    
  }]);
