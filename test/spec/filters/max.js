'use strict';

describe('Filter: max', function () {

  // load the filter's module
  beforeEach(module('keepr'));

  // initialize a new instance of the filter before each test
  var max;
  beforeEach(inject(function ($filter) {
    max = $filter('max');
  }));

  describe('"max" filter with numbers', function(){

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

  describe('"max" filter with JSON objects', function(){

    it('should return the number 500', function () {
      expect(max([{
        item: 0
      }, {
        item: 500
      }, {
        item: 100
      }], 'item')).toEqual(500);
    });

    it('should return undefined', function () {
      expect(max([{
        item: null,
        anotherItem: undefined
      },{
        item: null,
        anotherItem: undefined
      }], 'item')).toEqual(undefined);

      expect(max([{
        item: null,
        anotherItem: undefined
      },{
        item: null,
        anotherItem: undefined
      }], 'anotherItem')).toEqual(undefined);
    });
  });
});
