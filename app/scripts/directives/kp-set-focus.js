'use strict';
/**
 * @ngdoc directive
 * @name keepr.directives:kpSetFocus
 * @description Set the focus on the input field
 * # kpSetFocus
 */
angular.module('keepr.directives')
  .directive('kpSetFocus', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, ctrl) {
        $timeout(function(){
          element[0].focus();
        }, 100);
      }
    };
  }]);
