'use strict';

describe('Filter: capitalize', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var capitalize;
  beforeEach(inject(function ($filter) {
    capitalize = $filter('capitalize');
  }));

  it('should return the input string with first character in uppercase', function () {
    var text = 'angularjs';
    expect(capitalize(text)).toBe('Angularjs');
  });

  it('should return the input string empty if input element value is equal "undefined" or "null" ', function () {
    expect(capitalize(undefined)).toBe('');
    expect(capitalize(null)).toBe('');
  });

});
