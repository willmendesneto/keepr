'use strict';

/**
 * Returns the first value for "limit" method creation
 * @class startFrom
 * @module filters
 * @main startFrom
 * @class startFrom
 * @static
 */
angular.module('keepr.filters')
  .filter('startFrom', function () {
    return function(input, start) {
      start = +start; //parse to int
      return (typeof input === 'object' && input.length > 0 ) ? input.slice(start) : [];
    };
  });
