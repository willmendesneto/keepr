'use strict';

describe('Filter: list', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var list,
    arrayList;
  beforeEach(inject(function ($filter) {
    list = $filter('list');
    arrayList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }));

  it('should return a list using default separator string ", "', function () {
    expect(list(arrayList)).toBe('1, 2, 3, 4, 5, 6, 7, 8, 9');
  });

  it('should return a list using the separator passed for the filter', function () {
    expect(list(arrayList, '; ')).toBe('1; 2; 3; 4; 5; 6; 7; 8; 9');
    expect(list(arrayList, ', ')).toBe('1, 2, 3, 4, 5, 6, 7, 8, 9');
  });

});
