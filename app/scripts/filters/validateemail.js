'use strict';

/**
 * Filter used for Email valid verificattion
 * @class validateEmail
 * @module filters
 * @main validateEmail
 * @class validateEmail
 * @static
 */
angular.module('keepr.filters')
  .filter('validateEmail', function () {
    return function (input) {
      if (input === null || input === undefined) {
        return false;
      }
      var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return emailRegex.test(input);
    };
  });
