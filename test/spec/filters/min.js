'use strict';

describe('Filter: min', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var min;
  beforeEach(inject(function ($filter) {
    min = $filter('min');
  }));

  it('should return the number 0', function () {
    expect(min([
      null, undefined, 1337, 0
    ])).toEqual(0);
  });

  it('should return the number 1', function () {
    expect(min([
      null, 1, 1337, undefined
    ])).toEqual(1);
  });

  it('should return undefined', function () {
    expect(min([
      null, undefined
    ])).toEqual(undefined);
  });
});
