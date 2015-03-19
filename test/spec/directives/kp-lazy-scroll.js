'use strict';

describe('Directive: kpLazyScroll', function () {

  // load the directive's module
  beforeEach(module('keepr'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<div kp-lazy-scroll></div>');
    element = $compile(element)(scope);
    expect(element).toBeDefined();
  }));
});
