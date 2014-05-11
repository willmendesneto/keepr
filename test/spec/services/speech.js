'use strict';

describe('Service: Speech', function () {

  // load the service's module
  beforeEach(module('keepr'));

  // instantiate service
  var Speech,
    text,
    config;

  beforeEach(inject(function (_Speech_) {
    Speech = _Speech_;
    text = 'this is a text';
    config = {
      voiceIndex: 1,
      volume: 0,
      rate: 2,
      pitch: 1
    };
  }));

  describe('_msg', function () {
    it('should\'nt be undefined', function () {
      expect(Speech._msg !== undefined).toBe(true);
    });
  });

  describe('sayText', function () {
    it('should be returns "true"', function () {
      Speech.sayText(text, config);

      expect(Speech._msg.volume === 0).toBe(true);
      expect(Speech._msg.rate === 2).toBe(true);
      expect(Speech._msg.pitch === 1).toBe(true);

    });
  });

});
