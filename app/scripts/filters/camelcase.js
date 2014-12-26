'use strict';

/**
 * Provide camelcase filter for application
 * @class camelCase
 * @module filters
 * @main camelCase
 * @class camelCase
 * @static
 */
angular.module('keepr.filters')
  .filter('camelCase', ['$filter', function ($filter) {
    return function (input, firstWordWithCase) {
      if (input === null || input === undefined) {
        input = '';
      }

      var $trim = $filter('trim');
      //  First character with camel case
      if (!!firstWordWithCase) {
        input = $filter('capitalize')(input);
      }

      return $trim(input).replace(/[-_\s]+(.)?/g, function(match, c) {
        return c.toUpperCase();
      });
    };
  }]);
