'use strict';

describe('Service: CryptoOfflineStorageService', function () {

  // load the service's module
  beforeEach(module('keepr'));

  // instantiate service
  var CryptoOfflineStorageService,
    secret,
    storageType,
    key,
    string;

  describe('using "localStorage"', function(){

    beforeEach(inject(function (_CryptoOfflineStorageService_) {
      CryptoOfflineStorageService = _CryptoOfflineStorageService_;
      secret = 'secret';
      key = 'key';
      string = 'test';
    }));

    describe('init', function(){
      it('service should be initialyzeds with internal variables configurateds', function () {
        CryptoOfflineStorageService.init({secret: secret});

        expect(CryptoOfflineStorageService.JSON !== null).toBe(true);
        expect(CryptoOfflineStorageService.storageType === 'localStorage').toBe(true);
        expect(CryptoOfflineStorageService.CryptoJS !== null).toBe(true);
        expect(CryptoOfflineStorageService.secret !== '').toBe(true);
      });
    });

    describe('encrypt', function(){
      it('should returns a string with informations', function () {
        expect(typeof CryptoOfflineStorageService.encrypt(string, secret) === 'string').toBe(true);
      });
    });

    /*describe('decrypt', function(){
      it('should returns a string decrypted', function () {
        expect(CryptoOfflineStorageService.decrypt(string, secret)).toBe(string);
      });
    });*/

    describe('set', function(){
      it('should returns "true" when element is setted', function () {
        expect(CryptoOfflineStorageService.set(key, string)).toBe(true);
      });

      it('should returns "false" when second param isn\'t setted', function () {
        expect(CryptoOfflineStorageService.set(key)).toBe(false);
      });
    });

    describe('get', function(){
      it('should returns the original string', function () {
        CryptoOfflineStorageService.set(key, string);
        expect(CryptoOfflineStorageService.get(key)).toBe(string);
      });
    });

    describe('remove', function(){
      it('should returns "true" when element was removed with success', function () {
        CryptoOfflineStorageService.set(key, string);
        expect(CryptoOfflineStorageService.remove(key)).toBe(true);
      });
    });
  });

  describe('using "sessionStorage"', function(){

    beforeEach(inject(function (_CryptoOfflineStorageService_) {
      CryptoOfflineStorageService = _CryptoOfflineStorageService_;
      secret = 'secret';
      storageType = 'sessionStorage';
      key = 'key';
      string = 'test';
    }));

    describe('init', function(){
      it('service should be initialyzeds with internal variables configurateds', function () {
        CryptoOfflineStorageService.init({secret: secret, storageType: storageType});

        expect(CryptoOfflineStorageService.JSON !== null).toBe(true);
        expect(CryptoOfflineStorageService.storageType === storageType).toBe(true);
        expect(CryptoOfflineStorageService.CryptoJS !== null).toBe(true);
        expect(CryptoOfflineStorageService.secret !== '').toBe(true);
      });
    });

    describe('encrypt', function(){
      it('should returns a string with informations', function () {
        expect(typeof CryptoOfflineStorageService.encrypt(string, secret) === 'string').toBe(true);
      });
    });

    /*describe('decrypt', function(){
      it('should returns a string decrypted', function () {
        expect(CryptoOfflineStorageService.decrypt(string, secret)).toBe(string);
      });
    });*/

    describe('set', function(){
      it('should returns "true" when element is setted', function () {
        expect(CryptoOfflineStorageService.set(key, string)).toBe(true);
      });

      it('should returns "false" when second param isn\'t setted', function () {
        expect(CryptoOfflineStorageService.set(key)).toBe(false);
      });
    });

    describe('get', function(){
      it('should returns the original string', function () {
        CryptoOfflineStorageService.set(key, string);
        expect(CryptoOfflineStorageService.get(key)).toBe(string);
      });
    });

    describe('remove', function(){
      it('should returns "true" when element was removed with success', function () {
        CryptoOfflineStorageService.set(key, string);
        expect(CryptoOfflineStorageService.remove(key)).toBe(true);
      });
    });
  });
});
