'use strict';

describe('Filter: camelCase', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var camelCase, text;
  beforeEach(inject(function ($filter) {
    camelCase = $filter('camelCase');
    text = 'angular js';
  }));

  it('should return the input string with camelCase format', function () {
    expect(camelCase(text)).toBe('angularJs');
  });

  it('should return the input string with camelCase format with first word in Uppercase', function () {
    expect(camelCase(text, true)).toBe('AngularJs');
  });

  it('should return the input string empty if input element value is equal "undefined" or "null" ', function () {
    expect(camelCase(undefined)).toBe('');
    expect(camelCase(null)).toBe('');
  });

});
