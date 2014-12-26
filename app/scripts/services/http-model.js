'use strict';

angular.module('keepr.services')
  .factory('HttpModel', function HttpModel($q, $http, $filter) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var _params = {
      url: '',
      type : '_ngCache'+Math.floor((Math.random()*1000000)+1),
      cache: true
    };

    //Making possible to instance the typeof ModelCore
    return {

      /**
       * Params passed for HTTP request
       * @type {[type]}
       */
      _params: _params,

      /**
       * Response Cached
       * @type {Object}
       */
      _cache: false,

      init: function(params){
        var self = this;
        //  Extend params for create a factory in service
        angular.extend(self._params, params );
        return self;
      },

      /**
       * Get value of sessionStorage cache information
       * @return {[type]} [description]
       */
      _getCacheInfo: function(){
        if (this._cache !== false) {
          return this._cache;
        } else {
          var item = window.sessionStorage.getItem(this._params.type);
          return (item !== null) ? item : false;
        }
      },

      /**
       * Set value for sessionStorage cache information
       * @param {[type]} data [description]
       */
      _setCacheInfo: function(data){
        this._cache = data;
        window.sessionStorage.setItem(this._params.type, data);
      },

      /**
       * Return a promise with values of $http response
       * the $http API is based on the deferred/promise APIs exposed by the $q service
       * so it returns a promise for us by default
       * @return {[type]} [description]
       */
      $get: function(url){

        var deferred = $q.defer();
        if ( !!this._params.cache && this._getCacheInfo() !== false ) {
          deferred.resolve(this._getCacheInfo());
        } else {
          var self = this;
          $http.get( this._params.url + url ).success(function(data){
            self._setCacheInfo(data);
            deferred.resolve(data);
          }).error(function(error){
            deferred.reject(error);
          });
        }
        return deferred.promise;
      },

      /**
       * Find one element based in params passed for filter
       * @param  {[type]} params parameters object for search in dataset
       * @return {[type]}        [description]
       */
      $find: function(url, params){
        var deferred = $q.defer();
        this.$get(url).then(function(data){
          var result = $filter('filter')(data, params);
          deferred.resolve(result);
        });
        return deferred.promise;
      },

      /**
       * Return a promise with values of $http response using HTTP POST verb
       *
       * Used (normally) when you want insert a item in API
       *
       * the $http API is based on the deferred/promise APIs exposed by the $q service
       * so it returns a promise for us by default
       * @return {[type]} [description]
       */
      $post: function(url, params, headers){
        params = params || {};
        headers = headers || {};
        var deferred = $q.defer();
        $http.post( this._params.url + url, params, headers ).success(function(data){
          deferred.resolve(data);
        }).error(function(error){
          deferred.reject(error);
        });
        return deferred.promise;

      },

      /**
       * Return a promise with values of $http response using HTTP PUT verb
       *
       * Used when you want update a item in API
       *
       * the $http API is based on the deferred/promise APIs exposed by the $q service
       * so it returns a promise for us by default
       * @return {[type]} [description]
       */
      $put: function(url, params, headers){
        params = params || {};
        headers = headers || {};
        var deferred = $q.defer();
        $http.put( this._params.url + url, params, headers ).success(function(data){
          deferred.resolve(data);
        }).error(function(error){
          deferred.reject(error);
        });
        return deferred.promise;

      },

      /**
       * Return a promise with values of $http response using HTTP DELETE verb
       *
       * Used when you want delete a item in API
       *
       * the $http API is based on the deferred/promise APIs exposed by the $q service
       * so it returns a promise for us by default
       * @return {[type]} [description]
       */
      $delete: function(url){
        var deferred = $q.defer();
        $http.delete( this._params.url + url).success(function(data){
          deferred.resolve(data);
        }).error(function(error){
          deferred.reject(error);
        });
        return deferred.promise;

      },
    };
  });
