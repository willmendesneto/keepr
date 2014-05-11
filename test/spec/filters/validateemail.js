'use strict';

describe('Filter: validateEmail', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var validateEmail;
  beforeEach(inject(function ($filter) {
    validateEmail = $filter('validateEmail');
  }));

  it('should return "true" if input value is a email valid', function () {
    var email = 'test@test.com';
    expect(validateEmail(email)).toBeTruthy();
  });

  it('should return "false" if input value isn\'t a email valid', function () {
    var email = 'test-email-with-error';
    expect(validateEmail(email)).toBeFalsy();
  });

  it('should return false if input element value is equal "undefined" or "null" ', function () {
    expect(validateEmail(undefined)).toBeFalsy();
    expect(validateEmail(null)).toBeFalsy();
  });

});
