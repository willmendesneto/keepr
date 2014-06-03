'use strict';

/**
 * Provide a service for Crypt/Decrypt offline storage (localStorage/sessionStorage) data in application
 * @class CryptoOfflineStorageService
 * @module services
 * @main CryptoOfflineStorageService
 * @class CryptoOfflineStorageService
 * @static
 */
angular.module('keepr')
  .service('CryptoOfflineStorageService', function CryptoOfflineStorageService() {

    /**
     * Used for load external cryptojs library async
     * @property initialized
     * @type {Boolean}
     */
    var initialized = false;

    // AngularJS will instantiate a singleton by calling "new" on this function
    return {

      /**
       * Dependency Injection JSON object
       * @property JSON
       * @type {Object}
       */
      JSON : null,

      /**
       * Dependency Injection JSON object
       * @property CryptoJS
       * @type {Object}
       */
      CryptoJS : null,

      /**
       * Application secret key string
       * @property secret
       * @type {String}
       */
      secret : '',

      /**
       * Type of offline storage (localStorage/sessionStorage)
       * @type {String}
       */
      storageType : 'localStorage',

      /**
       * Initialyze service
       * @param  {String} secret Application secret key value
       * @method init
       */
      init: function(opts){

        //  Load crypto-js lib
        (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {
            return;
          }
          js = d.createElement(s);
          js.id = id;
          js.src = '//crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/tripledes.js';
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'ng-crypto-js'));

        initialized = true;
        this.JSON = window.JSON;
        this.CryptoJS = !!window.CryptoJS ? window.CryptoJS : false;

        angular.extend(this, opts);
      },

      // Private methods
      /**
       * Encrypt object values
       * @param  {Object} object Object for encrypt
       * @param  {String} secret Secret key for encrypt
       * @return {String}        String with encrypted values
       * @method encrypt
       */
      encrypt : function(object, secret) {
        var message = this.CryptoJS ? this.JSON.stringify(object) : object;
        return this.CryptoJS ? this.CryptoJS.TripleDES.encrypt(message, secret) : this.JSON.stringify(object);
      },

      /**
       * Decrypt object values
       * @param  {Object} object Object for decrypt
       * @param  {String} secret Secret key for encrypt
       * @return {String}           Decrypted string
       * @method decrypt
       */
      decrypt : function(encrypted, secret) {
        var decrypted = this.CryptoJS ? this.CryptoJS.TripleDES.decrypt(encrypted, secret) : this.JSON.parse(encrypted);
        return this.CryptoJS ? this.JSON.parse(decrypted.toString(this.CryptoJS.enc.Utf8)) : decrypted;
      },

      /**
       * Get element values in offline storage (localStorage/sessionStorage)
       * @param  {String} secret Secret key for encrypt
       * @return {String}           Decrypted string
       * @method get
       */
      get: function(key) {
        var encrypted = window[this.storageType].getItem(key);
        return this.decrypt(encrypted, this.secret);
      },

      /**
       * [set description]
       * @param  {String} secret Secret key for encrypt
       * @param  {Object} object Object for encrypt
       * @return {Boolean}
       * @method set
       */
      set: function(key, object) {
        if (!object) {
          this.remove(key);
          return false;
        }

        var encrypted = this.encrypt(object, this.secret);
        window[this.storageType].setItem(key, encrypted);
        return true;
      },

      /**
       * Remove element of offline storage (localStorage/sessionStorage)
       * @param  {String} secret Secret key for element
       * @return {Boolean}
       * @method remove
       */
      remove: function(key) {
        window[this.storageType].removeItem(key);
        return true;
      }
    };

  });
