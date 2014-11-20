'use strict';

describe('Directive: kpFlipContent', function () {

  // load the directive's module
  beforeEach(module('keepr'));

  var element,
    scope,
    flipEl;


  describe('kpFlipContent: Using "element"', function () {
    beforeEach(inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      flipEl = '<kp-flip-content data-click-toggle="true" data-mouseover-toggle="true">' +
                '<kp-flip-content-front>' +
                  '<img src="images/yeoman.png" alt="the front" />' +
                '</kp-flip-content-front>' +
                '<kp-flip-content-back>' +
                  '<img src="images/yeoman.png" alt="the back" />' +
                '</kp-flip-content-back>' +
              '</kp-flip-content>';
      element = angular.element(flipEl);
      element = $compile(element)(scope);
    }));

    it('should make hidden element visible', function () {
      element.triggerHandler('click');
      expect(element.hasClass('flipped')).toBe(true);

      element.triggerHandler('click');
      expect(element.hasClass('flipped')).toBe(false);
    });
  });


  describe('kpFlipContent: Using "attribute"', function () {
    beforeEach(inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      flipEl = '<div kp-flip-content data-click-toggle="true" data-mouseover-toggle="true">' +
                '<div kp-flip-content-front>' +
                  '<img src="images/yeoman.png" alt="the front" />' +
                '</div kp-flip-content-front>' +
                '<div kp-flip-content-back>' +
                  '<img src="images/yeoman.png" alt="the back" />' +
                '</div kp-flip-content-back>' +
              '</div kp-flip-content>';
      element = angular.element(flipEl);
      element = $compile(element)(scope);
    }));

    it('should make hidden element visible', function () {
      element.triggerHandler('click');
      expect(element.hasClass('flipped')).toBe(true);

      element.triggerHandler('click');
      expect(element.hasClass('flipped')).toBe(false);
    });
  });
});
