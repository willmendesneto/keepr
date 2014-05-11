'use strict';

describe('Filter: inflector', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var inflector, text;
  beforeEach(inject(function ($filter) {
    inflector = $filter('inflector');
    text = 'this is a string_text';
  }));

  it('should be returns a input humanized', function () {
    //var text = 'angularjs';
    expect(inflector(text, 'humanize')).toBe('This Is A String Text');
  });

  it('should be returns a input with "underscore"', function () {
    //var text = 'angularjs';
    expect(inflector(text, 'underscore')).toBe('this_is_a_string_text');
  });

  it('should be returns a input with variable', function () {
    //var text = 'angularjs';
    expect(inflector(text, 'variable')).toBe('thisIsAStringText');
  });

});
