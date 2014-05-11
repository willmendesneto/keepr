'use strict';

describe('Filter: snakeCase', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var snakeCase;
  beforeEach(inject(function ($filter) {
    snakeCase = $filter('snakeCase');
  }));

  it('should return the input string with snakecase format', function () {
    var text = 'angular js';
    expect(snakeCase(text)).toBe('angular_js');
  });

  it('should return the input string empty if input element value is equal "undefined" or "null" ', function () {
    expect(snakeCase(undefined)).toBe('');
    expect(snakeCase(null)).toBe('');
  });

});
