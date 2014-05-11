'use strict';

describe('Filter: trim', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var trim;
  beforeEach(inject(function ($filter) {
    trim = $filter('trim');
  }));

  it('should return the input string without spaces in left and right sides', function () {
    var text = '    angularjs  ';
    expect(trim(text)).toBe('angularjs');
  });

  it('should return the input string empty if input element value is equal "undefined" or "null" ', function () {
    expect(trim(undefined)).toBe('');
    expect(trim(null)).toBe('');
  });

});
