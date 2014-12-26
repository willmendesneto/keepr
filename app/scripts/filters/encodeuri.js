'use strict';

/**
 * Returns string encoded based in URI params
 * Example:
 * <a ng-href="/product/{{product.id}}?from={{'/products' | encodeUri}}">Go To Individual Product Page</a></p>
 * @class encodeUri
 * @module filters
 * @main encodeUri
 * @class encodeUri
 * @static
 */
angular.module('keepr.filters')
  .filter('encodeUri', function () {
    return function (input) {
      if (input === undefined || input === null) {
        return '';
      }
      return encodeURIComponent(input);
    };
  });
