'use strict';

/**
 * Returns string list + string separator based in string value
 * @class list
 * @module filters
 * @main list
 * @class list
 * @static
 */
angular.module('keepr.filters')
  .filter('list', function () {
    return function (input, separator) {
      if (separator === null || separator === undefined) {
        separator = ', ';
      }
      return input.join(separator);
    };
  });
