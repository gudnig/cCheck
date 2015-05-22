'use strict';

/**
 * @ngdoc function
 * @name cCheckApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cCheckApp
 */
angular.module('cCheckApp')
  .controller('MainCtrl',[ '$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
