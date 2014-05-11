'use strict';

describe('Service: CryptoLocalStorageService', function () {

  // load the service's module
  beforeEach(module('keepr'));

  // instantiate service
  var CryptoLocalStorageService,
    secret,
    key,
    string;

  beforeEach(inject(function (_CryptoLocalStorageService_) {
    CryptoLocalStorageService = _CryptoLocalStorageService_;
    secret = 'secret';
    key = 'key';
    string = 'test';
  }));

  it('should do something', function () {
    expect(!!CryptoLocalStorageService).toBe(true);
  });

  describe('init', function(){
    it('service should be initialyzeds with internal variables configurateds', function () {
      CryptoLocalStorageService.init(secret);

      expect(CryptoLocalStorageService.JSON !== null).toBe(true);
      expect(CryptoLocalStorageService.CryptoJS !== null).toBe(true);
      expect(CryptoLocalStorageService.secret !== '').toBe(true);
    });
  });

  describe('encrypt', function(){
    it('should returns a string with informations', function () {
      expect(typeof CryptoLocalStorageService.encrypt(string, secret) === 'string').toBe(true);
    });
  });

  describe('decrypt', function(){
    it('should returns a string decrypted', function () {
      expect(CryptoLocalStorageService.decrypt(string, secret)).toBe(string);
    });
  });

  describe('set', function(){
    it('should returns "true" when element is setted', function () {
      expect(CryptoLocalStorageService.set(key, string)).toBe(true);
    });

    it('should returns "false" when second param isn\'t setted', function () {
      expect(CryptoLocalStorageService.set(key)).toBe(false);
    });
  });

  describe('get', function(){
    it('should returns the original string', function () {
      CryptoLocalStorageService.set(key, string);
      expect(CryptoLocalStorageService.get(key)).toBe(string);
    });
  });

  describe('remove', function(){
    it('should returns "true" when element was removed with success', function () {
      CryptoLocalStorageService.set(key, string);
      expect(CryptoLocalStorageService.remove(key)).toBe(true);
    });
  });

});
