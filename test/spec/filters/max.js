'use strict';

describe('Filter: max', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var max;
  beforeEach(inject(function ($filter) {
    max = $filter('max');
  }));

  it('should return the number 1337', function () {
    expect(max([
      null, undefined, 1337, 0
    ])).toEqual(1337);
  });

  it('should return the number 1337', function () {
    expect(max([
      null, 0, 1337, undefined
    ])).toEqual(1337);
  });

  it('should return undefined', function () {
    expect(max([
      null, undefined
    ])).toEqual(undefined);
  });

});
