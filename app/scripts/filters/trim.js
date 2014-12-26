'use strict';

/**
 * Returns string without spaces based in param
 * @class trim
 * @module filters
 * @main trim
 * @class trim
 * @static
 */
angular.module('keepr.filters')
  .filter('trim', function () {
    return function (input) {
      var str;
      if (input === undefined || input === null) {
        input = '';
      }
      str = String(input);
      if (String.prototype.trim !== null) {
        return str.trim();
      } else {
        return str.replace(/^\s+|\s+$/gm, '');
      }
    };
  });
