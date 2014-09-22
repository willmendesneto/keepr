'use strict';

angular.module('keepr')
  .directive('oneBind', function($window) {
    var removeWatch = function(scope, el) {
      scope.$destroy();
      el.removeClass('ng-binding ng-scope');
    };

    return {
      scope: true,
      link: function($scope, $el) {
        if ('load' in $window) {
          $window.load(function() {
            removeWatch($scope, $el);
          });
        } else {
          removeWatch($scope, $el);
        }
      }
    };
  });
