'use strict';

describe('Directive: kpMask', function () {

  // load the directive's module
  beforeEach(module('keepr'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.x = 1234567890;
    element = $compile('<input kp-mask="\'(999).999-9999\'" placeholder="(___).___-____" ng-model="x"></input>')(scope);

  }));

  describe('simple use on input element', function() {
    it('should have a mask attached', function() {
      expect(element).toBeDefined();
    });
  });

});
