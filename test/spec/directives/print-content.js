'use strict';

describe('Directive: kpPrintContent', function () {

  // load the directive's module
  beforeEach(module('keepr'));

  var element,
    scope,
    rootScope,
    field = '<button type="button" kp-print-content print-options="printOptions" class="btn btn-primary">Imprimir</button>' +
            '<div id="target"><p>Exemplo</p></div>'
  ;

  beforeEach(inject(function ($rootScope, $compile) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    scope.printOptions ={
      removeBind: true,
      target: '#target',
      title: 'Print',
      alert: false
    };

    element = $compile(field)(scope);

  }));

  it('should make hidden element visible', function () {
    expect(element).toBeDefined();
    scope.$apply();
  });
});
