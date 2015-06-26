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
      return $resource(API_URL + 'fighters/:id\/', { id: '@id' },{
			update: {
				method: 'PUT'
			}
  		});    
  }])
  .factory('users', ['$resource', 'API_URL', function ($resource, API_URL) {    
      return $resource(API_URL + 'users/:id', { id: '@id' },{
			update: {
				method: 'PUT'
			}
  		});    
  }]) 
  .factory('sessions', ['$resource', 'API_URL', function ($resource, API_URL) {    
      return $resource(API_URL + 'sessions/:id', { id: '@id' },{
			update: {
				method: 'PUT'
			}
  		});    
  }]);
