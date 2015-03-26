'use strict';
/**
 * @ngdoc directive
 * @name keepr.directives:kpResetErrors
 * @description clicking on the cancel button broadcast the event
 * 'show-errors-reset' for the directive kpShowErrors for remove
 * the class .has-error from the .form-group element
 * With the attrubute kp-reset-object you can pass an object to be cleared
 * Example:
 * <form novalidate name="form" kp-validate-submit="vm.save(vm.myObject)">
 *
 *   <div class="form-group" kp-show-errors>
 *     <label for="fieldName">Field Name</label>
 *     <select class="form-control" name="fieldName" ... ></select>
 *   </div>
 *
 *  <button type="button" kp-reset-errors kp-reset-object="vm.myObject">Cancel</button>
 *  <button type="submit" >Submit</button>
 *
 * </form>
 *
 * # kpResetErrors
 */
angular.module('keepr.directives')
  .directive('kpResetErrors', function() {
    return {
      restrict: 'A',
      scope: {
        kpResetObject: '='
      },
      link: function (scope, element, attrs) {
        element.bind('click', function (event) {
          if(angular.isObject(scope.kpResetObject)){
            scope.kpResetObject = {};
          }
          scope.$broadcast('show-errors-reset');
        });
      }
    };
  });
