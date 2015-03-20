'use strict';

describe('Directive: kpFocus', function () {

  // load the directive's module
  beforeEach(module('keepr'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {

    scope = $rootScope.$new();
    scope.x = '1234567890xpto';
    element = $compile('<input kp-focus type="text" placeholder="_" ng-model="x" required />')(scope);
    scope.$digest();
  }));

  it('should have a kp-focus defined', function() {
    expect(element).toBeDefined();
  });

  it('should have a form field required in focus', function() {
    spyOn(scope, '$apply');

    element.val('baz');
    element.triggerHandler('focus');

    expect(scope.$apply).toHaveBeenCalled();

    element.triggerHandler('blur');
    expect(scope.$apply).toHaveBeenCalled();
  });
});
