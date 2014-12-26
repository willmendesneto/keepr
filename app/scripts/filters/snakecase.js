'use strict';

/**
 * Returns string in snakeCase format based in param
 * @class snakeCase
 * @module filters
 * @main snakeCase
 * @class snakeCase
 * @static
 */
angular.module('keepr.filters')
  .filter('snakeCase', ['$filter', function ($filter) {
    return function (input) {
      if (input === null || input === undefined) {
        input = '';
      }
      var $trim = $filter('trim');
      return $trim(input).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
    };
  }]);
