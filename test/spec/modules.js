'use strict';

describe('Keepr: module definitions', function () {

  var dependencies = [];

  var hasModule = function(module) {
    return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function () {
    dependencies = angular.module('keepr').requires;
  });

  it('should load directives module', function () {
    expect(hasModule('keepr.directives')).toBe(true);
  });

  it('should load filters module', function () {
    expect(hasModule('keepr.filters')).toBe(true);
  });

  it('should load services module', function () {
    expect(hasModule('keepr.services')).toBe(true);
  });

});
