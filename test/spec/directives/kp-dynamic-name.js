'use strict';

describe('Directive: kpDynamicName', function () {

  // load the directive's module
  beforeEach(module('keepr'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    var htmlTemplate = '<input type="text" ' +
      'ng-attr-id="test" ' +
      'kp-dynamic-name="myDynamicName1"' +
      'ng-required="true" ' +
      'placeholder="This is a test" ' +
      'maxlength="10" >';
    element = angular.element(htmlTemplate);
    $compile(element)(scope);

    expect(element.attr('name')).toBe('myDynamicName1');
  }));
});
