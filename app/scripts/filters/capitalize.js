'use strict';

/**
 * Provide capitalize filter for application
 * @class capitalize
 * @module filters
 * @main capitalize
 * @class capitalize
 * @static
 */
angular.module('keepr.filters')
  .filter('capitalize', function () {
    return function (input) {
      var str;
      if (input === undefined || input === null) {
        input = '';
      }
      str = String(input);
      return str.charAt(0).toUpperCase() + str.substring(1);
    };
  });
