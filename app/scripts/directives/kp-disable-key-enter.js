'use strict';
/**
 * @ngdoc directive
 * @name keepr.directives:kpDisableKeyEnter
 * @description prevent the form submission pressing the key enter
 * # kpDisableKeyEnter
 */
angular.module('keepr.directives')
  .directive('kpDisableKeyEnter', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (element) {
        element.bind('keydown', function(event){
          if(event.which === 13){
            event.preventDefault();
            window.stop();
            document.execCommand('Stop');
            return false;
          }
        });
      }
    };
  });
