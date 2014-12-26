'use strict';

/**
 * Validate input element on focus/blur event
 *
 * @module directives
 * @main kpFocus
 * @static
 */
angular.module('keepr.directives')
  .directive('kpFocus', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, controller) {
        controller.$focused = false;

        /**
         * Activate directive on focus event
         * @return
         */
        element.bind('focus', function(){
          scope.$apply(function(){
            controller.$focused = true;
          });
        })

        /**
         * Deactivate directive on blur event
         * @return
         */
        .bind('blur', function(){
          scope.$apply(function(){
            controller.$focused = false;
          });
        });

        /**
         * Destroy events on "$destroy" scope event
         * @return
         */
        scope.$on('$destroy', function() {
          element.unbind('blur focus');
        });
      }
    };
  });
