'use strict';

/**
 * Returns maximum value based in string value
 * @class max
 * @module filters
 * @main max
 * @class max
 * @static
 */
angular.module('keepr.filters')
  .filter('max', function () {
    return function (input, elementKey) {
      var out;
      if (!input) {
        return;
      }
      if (elementKey === undefined || elementKey === null) {
        elementKey = false;
      }
      for (var i in input) {
        if (!elementKey) {
          if (input[i] > out || out === undefined || out === null) {
            out = input[i];
          }
        } else {
          if (typeof input[i][elementKey] !== 'undefined' && (input[i][elementKey] > out || out === undefined || out === null)) {
            out = input[i][elementKey];
          }
        }
      }
      return out;
    };
  });
