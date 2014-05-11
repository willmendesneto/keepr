'use strict';

describe('Filter: charactersQuantity', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var charactersQuantity;
  beforeEach(inject(function ($filter) {
    charactersQuantity = $filter('charactersQuantity');
  }));

  it('should do nothing to this string', function () {
    expect(charactersQuantity('1234567890')).toEqual('1234567890');
  });

  it('should fail if input value was "null"', function () {
    expect(charactersQuantity(null, 30)).toNotEqual('1234567890');
  });

  it('should fail if input value was "undefined"', function () {
    expect(charactersQuantity(undefined, 30)).toNotEqual('1234567890');
  });

  it('should not trim these down', function () {
    expect(charactersQuantity('1234567890', 30)).toEqual('1234567890');
  });

  it('should trim these down', function () {
    expect(charactersQuantity('1234567890', 5)).toEqual('12345...');
  });

  it('should trim this down including the space', function () {
    expect(charactersQuantity('123456789 10 11 12 13 14', 13)).toEqual('123456789 10...');
  });

  it('should trim this down breaking on words', function () {
    expect(charactersQuantity('123456789 10 11 12 13 14', 14,true)).toEqual('123456789 10 1...');
  });

  it('should trim this down ignoring the space', function () {
    expect(charactersQuantity('Florida/New Jersey/California/Texas', 30, true)).toEqual('Florida/New Jersey/California/...');
  });

  it('should handle invalid numbers', function () {
    expect(charactersQuantity('1234567890', 0)).toEqual('');
  });

  it('should handle invalid chars numbers type', function () {
    expect(charactersQuantity('1234567890', 'abc')).toEqual('1234567890');
  });

});
