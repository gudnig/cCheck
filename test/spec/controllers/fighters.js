'use strict';

describe('Controller: FightersCtrl', function () {

  // load the controller's module
  beforeEach(module('cCheckApp'));

  var FightersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FightersCtrl = $controller('FightersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
