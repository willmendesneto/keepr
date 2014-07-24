'use strict';

describe('Filter: startFrom', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var startFrom;
  beforeEach(inject(function ($filter) {
    startFrom = $filter('startFrom');
  }));

  it('should return the input prefixed with "startFrom filter:"', function () {
    expect(typeof startFrom([0])).toBe('object');
  });

});
