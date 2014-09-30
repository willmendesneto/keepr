'use strict';

describe('Directive: oneBind', function () {

  // load the directive's module
  beforeEach(module('keepr'));

  var element,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    scope.xpto = 'this is the oneBind directive';
    element = $compile('<span kp-one-bind>{{xpto}}</span>')(scope);
    scope.$digest();
  }));

  it('should remove internal classes for bind', function () {
    expect(element.hasClass('ng-binding ng-scope')).toBe(false);
  });
});
