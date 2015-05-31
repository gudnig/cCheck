'use strict';

describe('Controller: AddtraineeCtrl', function () {

  // load the controller's module
  beforeEach(module('cCheckApp'));

  var AddtraineeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddtraineeCtrl = $controller('AddtraineeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
