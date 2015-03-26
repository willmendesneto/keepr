'use strict';
/**
 * @ngdoc directive
 * @name keepr.directives:kpShowErrors
 * @description this directive add or remove the class .has-error
 * depending the input validation also listening the events
 * 'show-errors-check-validity' and 'show-errors-reset'
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
 *
 * </form>
 *
 * # kpShowErrors
 */
angular.module('keepr.directives')
  .directive('kpShowErrors', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      require:  '^form',
      link: function (scope, element, attrs, ctrl) {
        var inputEl   = element[0].querySelector("[name]"),
          inputNgEl = angular.element(inputEl),
          inputName = inputNgEl.attr('name');

        inputNgEl.bind('blur', function() {
          element.toggleClass('has-error', ctrl[inputName].$invalid);
        });

        scope.$on('show-errors-check-validity', function() {
          element.toggleClass('has-error', ctrl[inputName].$invalid);
        });

        scope.$on('show-errors-reset', function() {
          $timeout(function() {
            element.removeClass('has-error');
          }, 0, false);
        });
      }
    };
  }]);
