'use strict';

describe('Filter: uncapitalize', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var uncapitalize;
  beforeEach(inject(function ($filter) {
    uncapitalize = $filter('uncapitalize');
  }));

  it('should return the input string with first character in uppercase', function () {
    var text = 'Angularjs';
    expect(uncapitalize(text)).toBe('angularjs');
  });

  it('should return the input string empty if input element value is equal "undefined" or "null" ', function () {
    expect(uncapitalize(undefined)).toBe('');
    expect(uncapitalize(null)).toBe('');
  });
});
