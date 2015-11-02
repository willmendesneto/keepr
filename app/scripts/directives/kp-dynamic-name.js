'use strict';

/**
 * Add flip content for images in aplication
 * @module directives
 * @main kpDynamicName
 * @class kpDynamicName
 * @static
 */
angular.module('keepr.directives')
  .directive('kpDynamicName', function($compile, $interpolate) {
    return {
      restrict: 'A',
      terminal: true,
      priority: 100000,
      link: function(scope, elem) {
        var name = $interpolate(elem.attr('kp-dynamic-name'))(scope);
        elem.removeAttr('kp-dynamic-name');
        elem.attr('name', name);
        $compile(elem)(scope);
      }
    };
  });
