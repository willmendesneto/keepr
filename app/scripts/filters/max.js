'use strict';

/**
 * Returns maximum value based in string value
 * @class max
 * @module filters
 * @main max
 * @class max
 * @static
 */
angular.module('keepr')
  .filter('max', function () {
    return function (input) {
      var out;
      if (!input) {
        return;
      }
      for (var i in input) {
        if (input[i] > out || out === undefined || out === null) {
          out = input[i];
        }
      }
      return out;
    };
  });
