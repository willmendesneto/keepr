'use strict';

describe('Directive: showErrors', function () {

  // load the directive's module
  beforeEach(module('keepr'));

  var element,
    rootScope,
    hasErrorClass = 'my-awesome-class',
    form,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    scope.test = '';

    var htmlTemplate = '' +
    '<form name="form" novalidate>' +
      '<div class="form-group" kp-show-errors> ' +
        '<label for="text">Test Field Name</label>' +
        '<input type="text" ' +
          'id="test" ' +
          'name="test" ' +
          'ng-model="test" ' +
          'kp-show-errors-class="my-awesome-class" ' +
          'placeholder="This is a test" ' +
          'minlength="5" ' +
          'maxlength="10"/>' +
      '</div>' +
    '</form>';
    element = angular.element(htmlTemplate);
    element = $compile(element)(scope);
    form = scope.form;
    scope.$digest();
  }));

  it('should add show errors class when input value is invalid', function () {

    expect(element).not.toHaveClass(hasErrorClass);

    form.test.$setViewValue('test');
    scope.$broadcast('show-errors-check-validity');
    scope.$digest();

    expect(element.html()).toContain(hasErrorClass);
  });

  it('should remove show errors class when input value is valid', function() {
    form.test.$setViewValue('testing');
    scope.$broadcast('show-errors-check-validity');
    scope.$digest();

    expect(form.test.$viewValue).toEqual('testing');
    expect(form.test.$valid).toBe(true);
    expect(form.test.$invalid).toBe(false);

    expect(element.html()).not.toContain(hasErrorClass);

  });
});
