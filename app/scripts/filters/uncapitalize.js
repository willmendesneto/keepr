'use strict';

/**
 * Returns string with first character in lower case
 * @class uncapitalize
 * @module filters
 * @main uncapitalize
 * @class uncapitalize
 * @static
 */
angular.module('keepr.filters')
  .filter('uncapitalize', function () {
    return function (input) {
      var str;
      if (input === undefined || input === null) {
        input = '';
      }
      str = String(input);
      return str.charAt(0).toLowerCase() + str.substring(1);
    };
  });
