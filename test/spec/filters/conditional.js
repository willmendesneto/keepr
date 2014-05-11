'use strict';

describe('Filter: conditional', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var conditional;
  beforeEach(inject(function ($filter) {
    conditional = $filter('conditional');
  }));

  it('should return the first param in "conditional filter:"', function () {
    var text = 'true';
    expect(conditional(text, 'true', 'false')).toBe('true');
  });

  it('should return the second param in "conditional filter:"', function () {
    var text = 'false';
    expect(conditional(text, 'true', 'false')).toBe('false');
  });

});
