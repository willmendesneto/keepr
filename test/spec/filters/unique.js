'use strict';

describe('Filter: unique', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var unique,
    array;
  beforeEach(inject(function ($filter) {
    unique = $filter('unique');
    array = [1, 2, 3, 4, 5, 5, 6, 6, 6, 7, 8, 9];
  }));

  it('should return an array with unique values', function () {
    var arrayUnique = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(unique(array)).toEqual(arrayUnique);
  });

  it('should return the same array if second param value equals false', function () {
    expect(unique(array, false)).toEqual(array);
  });

});
