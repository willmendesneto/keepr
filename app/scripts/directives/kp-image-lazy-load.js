'use strict';

/**
 * @ngdoc directive
 * @name keepr.directives:kpImageLazyLoad
 * @description
 * # kpImageLazyLoad
 */
angular.module('keepr.directives')
  .directive('kpImageLazyLoad', function ($document, $timeout, $window) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var scrollTimeoutId;
        var deregistration = scope.$on('lazyScrollEvent', function () {
          loadImageSrc();
        });

        var imageTimeoutValue = attrs.timeout || 500;

        function elementIsVisibleInTemplate() {
          var clientHeight = parseInt($window.pageYOffset);
          var clientWidth = parseInt($document[0].documentElement.clientWidth);
          var imageRect = element[0].getBoundingClientRect();
          return  (imageRect.top >= 0 && ((element[0].clientHeight + clientHeight + $window.innerHeight) >= parseInt(imageRect.bottom))) && (imageRect.left >= 0 && imageRect.right <= clientWidth);
        }

        function loadImageSrc() {
          if ((attrs.loadVerification !== undefined && attrs.loadVerification === 'false') ||
              (elementIsVisibleInTemplate() && (attrs.kpImageLazyLoad !== undefined && attrs.kpImageLazyLoad !== ''))) {
            element[0].src = attrs.kpImageLazyLoad;
            element.removeAttr('kp-image-lazy-load');
            element.removeAttr('load-verification');
          }
        }

        element.on('$destroy', function () {
          deregistration();
        });

        scrollTimeoutId = $timeout(loadImageSrc, imageTimeoutValue);
      }
    };
  });
