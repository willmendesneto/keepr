'use strict';

describe('Filter: wordsQuantity', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var wordsQuantity;
  beforeEach(inject(function ($filter) {
    wordsQuantity = $filter('wordsQuantity');
  }));

  it('should do nothing to this string', function () {
    expect(wordsQuantity('1234567890')).toEqual('1234567890');
  });

  it('should do nothing to this multi words string', function () {
    expect(wordsQuantity('1234567890 abc def')).toEqual('1234567890 abc def');
  });

  it('should fail', function () {
    expect(wordsQuantity(null, 30)).toNotEqual('1234567890');
  });

  it('should not trim these down', function () {
    expect(wordsQuantity('1234567890', 1)).toEqual('1234567890');
  });

  it('should trim these down', function () {
    expect(wordsQuantity('abc def ghhi jkl mno pqr stu vw xyz', 5)).toEqual('abc def ghhi jkl mno...');
  });

  it('should trim these down and handle multi-spaces', function () {
    expect(wordsQuantity('abc def    ghhi jkl    mno pqr stu    vw   xyz', 5)).toEqual('abc def ghhi jkl mno...');
  });

  it('should not trim invalid words numbers', function () {
    expect(wordsQuantity('abc def ghhi jkl mno pqr stu vw xyz', 0)).toEqual('');
  });

  it('should not trim invalid words type', function () {
    expect(wordsQuantity('hello how u doin', 'abc')).toEqual('hello how u doin');
  });

  it('should not trim higher words numbers', function () {
    expect(wordsQuantity('abc def ghhi jkl mno pqr stu vw xyz', 25)).toEqual('abc def ghhi jkl mno pqr stu vw xyz');
  });

});
