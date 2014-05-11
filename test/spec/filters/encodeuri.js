'use strict';

describe('Filter: encodeUri', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var encodeUri;
  beforeEach(inject(function ($filter) {
    encodeUri = $filter('encodeUri');
  }));

  it('should return the input prefixed with "encodeUri filter:"', function () {
    var text = 'http://localhost/test=1';
    expect(encodeUri(text)).toBe('http%3A%2F%2Flocalhost%2Ftest%3D1');
  });

  it('should return the input string empty if input element value is equal "undefined" or "null" ', function () {
    expect(encodeUri(undefined)).toBe('');
    expect(encodeUri(null)).toBe('');
  });

});
