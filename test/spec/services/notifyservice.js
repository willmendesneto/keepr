'use strict';

describe('Service: NotifyService', function () {

  // load the service's module
  beforeEach(module('keepr'));

  // instantiate service
  var NotifyService;
  beforeEach(inject(function (_NotifyService_) {
    NotifyService = _NotifyService_;
  }));

  it('should do something', function () {
    expect(!!NotifyService).toBe(true);
  });

});
