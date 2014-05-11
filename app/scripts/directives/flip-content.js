'use strict';

/**
 * Add flip content for images in aplication
 * @module directives
 * @main kpFlipContent
 * @class kpFlipContent
 * @static
 */
angular.module('keepr')
  .directive('kpFlipContent', function () {

    /**
     * Controller to directive
     * #### Example of user
     * `<div class="kp-flip-content" data-click-toggle="true" data-mouseover-toggle="true">
     *    <div class="kp-flip-content-front">
     *      <img src="images/yeoman.png" alt="the front" />
     *    </div>
     *    <div class="kp-flip-content-back">
     *      <img src="images/yeoman.png" alt="the back" />
     *    </div>
     *  </div>`
     * @param  {kp-flip-content} Class for element delimiter
     * @method kpFlipContent
     */
    return {
      restrict: 'CA',
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
