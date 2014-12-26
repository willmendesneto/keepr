'use strict';

/**
 * Returns minimum value based in string value
 * @class min
 * @module filters
 * @main min
 * @class min
 * @static
 */
angular.module('keepr.filters')
  .filter('min', function () {
    return function (input) {
      var out;
      if (!input) {
        return;
      }
      for (var i in input) {
        if (input[i] < out || out === undefined || out === null) {
          out = input[i];
        }
      }
      return out;
    };
  });
