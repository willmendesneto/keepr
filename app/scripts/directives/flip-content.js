'use strict';

/**
 * Add flip content for images in aplication
 * @module directives
 * @main kpFlipContent
 * @class kpFlipContent
 * @static
 */
angular.module('keepr.directives')
  .directive('kpFlipContent', function () {

    /**
     * Controller to directive
     * #### Example of user
     * `<kp-flip-content data-click-toggle="true" data-mouseover-toggle="true">
     *    <kp-flip-content-front>
     *      <img src="images/yeoman.png" alt="the front" />
     *    </kp-flip-content-front>
     *    <kp-flip-content-back>
     *      <img src="images/yeoman.png" alt="the back" />
     *    </kp-flip-content-back>
     *  </kp-flip-content>`
     * @param  {kp-flip-content} Element/Attribute for element delimiter
     * @method kpFlipContent
     */
    return {
      restrict: 'EA',
      scope: {},
      link: function($scope, $elem, $attrs) {
        /**
         * behaviour for flipping effect.
         */
        var flip = function() {
          $elem.toggleClass('flipped');
        };

        if ($attrs.clickToggle) {
          $elem.bind('click', flip);
        }
        if ($attrs.mouseoverToggle) {
          $elem.bind('mouseenter mouseleave', flip);
        }

        $scope.$on('$destroy', function() {
          $elem.unbind('mouseenter mouseleave');
        });

      }
    };
  });
