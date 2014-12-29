'use strict';

describe('Directive: kpMask', function () {

  // load the directive's module
  beforeEach(module('keepr'));

  var element,
    scope,
    rootScope,
    field = '<input name="phone" kp-mask="\'(999).999-9999\'" kp-clean-field="false" kp-placeholder="Add your cellphone" ng-model="x" />'
  ;

  beforeEach(inject(function ($rootScope, $compile) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    scope.x = 1234567890;
    element = $compile(field)(scope);
  }));

  it('should have a mask attached', function() {
    expect(element).toBeDefined();
  });

  it('should have a placeholder attached', function() {
    expect(element).toBeDefined();
    scope.$apply();

    expect(element.attr('kp-placeholder')).toBeDefined();
    expect(element.attr('placeholder')).toBeDefined();

    expect(element.attr('kp-placeholder')).toEqual('Add your cellphone');
    expect(element.attr('placeholder')).toEqual('Add your cellphone');
  });

});
