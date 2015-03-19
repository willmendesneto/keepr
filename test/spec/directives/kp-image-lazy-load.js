'use strict';

describe('Directive: kpImageLazyLoad', function () {

  // load the directive's module
  beforeEach(module('keepr'));

  var element,
    imageSrc,
    rootScope,
    imageFinalSrc,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    imageSrc = 'logo-keepr.png';
    imageFinalSrc = 'keepr.png';
    element = angular.element('<div kp-lazy-scroll>' +
      '<img load-verification="false" kp-image-lazy-load="' + imageFinalSrc + '" src="' + imageSrc + '" /></div>');

    element = $compile(element)(scope);
  }));

  it('should update a src value in a image tag', function () {
    expect(element).toBeDefined();

    scope.$broadcast('lazyScrollEvent');
    rootScope.$apply();

    expect(element.find('img').attr('src') === imageFinalSrc).toBe(true);
    expect(element.find('img').attr('kp-lazy-load') === undefined).toBe(true);
    expect(element.find('img').attr('load-verification') === undefined).toBe(true);
  });
});
