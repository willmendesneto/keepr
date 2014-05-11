'use strict';

describe('Directive: kpFlipContent', function () {

  // load the directive's module
  beforeEach(module('keepr'));

  var element,
    scope,
    flipEl;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    flipEl = '<div class="kp-flip-content" data-click-toggle="true" data-mouseover-toggle="true">' +
              '<div class="kp-flip-content-front">' +
                '<img src="images/yeoman.png" alt="the front" />' +
              '</div>' +
              '<div class="kp-flip-content-back">' +
                '<img src="images/yeoman.png" alt="the back" />' +
              '</div>' +
            '</div>';
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
