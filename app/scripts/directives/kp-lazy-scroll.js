'use strict';

/**
 * @ngdoc directive
 * @name keepr.directives:kpLazyScroll
 * @description
 * # kpLazyScroll
 */
angular.module('keepr.directives')
. directive('kpLazyScroll', function($document, $rootScope, $timeout) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var scrollTimeoutId = 0;

        scope.invoke = function () {
          $rootScope.$broadcast('lazyScrollEvent');
        };

        element.on('$destroy', function () {
          $document.unbind('scroll');
        });

        $document.bind('scroll', function () {
          $timeout.cancel(scrollTimeoutId);
          scrollTimeoutId = $timeout(scope.invoke, 0);
        });
      }
    };
  });
