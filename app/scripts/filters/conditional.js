'use strict';

/**
 * Returns string conditional based in params passed for application
 * Example:
 * <a ng-href="{{ isProduct | conditional:'/product/':'/user/'}}{{object.id}}">My Object</a>
 * @class conditional
 * @module filters
 * @main conditional
 * @class conditional
 * @static
 */
angular.module('keepr.filters')
  .filter('conditional', function () {
    return function(input, trueCase, falseCase) {
      return input === trueCase ? trueCase : falseCase;
    };
  });
