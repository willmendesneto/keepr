'use strict';

describe('Directive: kpFocus', function () {

  // load the directive's module
  beforeEach(module('keepr'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {

    scope = $rootScope.$new();
    scope.x = '1234567890xpto';
    element = $compile('<input kp-focus type="text" placeholder="_" ng-model="x" required></input>')(scope);
    scope.$digest();
  }));

  it('should have a kp-focus defined', function() {
    expect(element).toBeDefined();
  });
});
