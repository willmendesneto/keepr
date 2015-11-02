'use strict';
/**
 * @ngdoc directive
 * @name keepr.directives:kpValidateSubmit
 * @description submit the form only if the form pass the validation,
 * if not broadcast the event 'show-errors-check-validity' for the
 * directive kpShowErrors that apply the class .has-error on the .form-group element
 *
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

 * </form>
 *
 * # kpValidateSubmit
 */
angular.module('keepr.directives')
  .directive('kpValidateSubmit', ['$parse', function($parse) {
    return {
      restrict: 'A',
      require: 'form',
      link: function (scope, element, attrs, ctrl) {
        var fn = $parse(attrs.kpValidateSubmit);
        element.bind('submit', function (event) {
          scope.$broadcast('show-errors-check-validity');
          // if form is not valid cancel it.
          if (!ctrl.$valid){
            return false;
          }
          scope.$apply(function() {
            fn(scope, {$event:event});
          });
        });
      }
    };
  }]);
