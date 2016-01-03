'use strict';

describe('Service: AlertService', function () {

  // load the service's module
  beforeEach(module('keepr'));

  // instantiate service
  var AlertService, rootScope, message, timeout;
  beforeEach(inject(function (_AlertService_, $rootScope, $timeout) {
    AlertService = _AlertService_;
    rootScope = $rootScope;
    timeout = $timeout;
    message = {
      type: 'success',
      msg: 'This is a alert with 5 seconds of lifetime!'
    };
  }));

  afterEach(function(){
    AlertService.clear();
  });

  it('#add', function () {
    expect(rootScope.alerts.length).toBe(0);

    AlertService.add(message.type, message.msg, 5000);
    expect(rootScope.alerts.length).toBe(1);
    expect(rootScope.alerts[0].type === message.type).toBe(true);
    expect(rootScope.alerts[0].msg === message.msg).toBe(true);

    timeout.flush(5000);
    expect(rootScope.alerts.length).toBe(0);

  });

  it('#clear', function(){
    expect(rootScope.alerts.length).toBe(0);
    AlertService.add(message.type, message.msg);
    expect(rootScope.alerts.length).toBe(1);

    AlertService.clear();
    expect(rootScope.alerts.length).toBe(0);
  });

  it('#closeAlertMessage', function(){
    expect(rootScope.alerts.length).toBe(0);
    AlertService.add(message.type, message.msg);
    message.type = 'warn';
    message.type = 'Mock Test';
    AlertService.add(message.type, message.msg);

    expect(rootScope.alerts.length).toBe(2);

    AlertService.closeAlertMessage(1);
    var alertObjectWasRemoved = rootScope.alerts.filter(function(item){
      return item.type === message.type &&
        item.msg === message.msg;
    }).length === 0;

    expect(rootScope.alerts.length).toBe(1);
    expect(alertObjectWasRemoved).toBe(true);
  });

});
