'use strict';

angular.module('keepr.services')
  .factory('OfflineModel', function OfflineModel($filter, CryptoOfflineStorageService) {

    // Service logic
    // ...

    var _key = null,
        _items = null,
        _fields = null
    ;

    // Public API here
    return {
      _secret: 'my-awesome-key',
      init: function (key, _items, fields, params) {

        var self = this;
        _fields = fields || null;
        _key = key;
        params = params || {};
        angular.extend(self, params);

        CryptoOfflineStorageService.init({secret: self._secret});
        var _itemsCached = CryptoOfflineStorageService.get(_key);

        if(_itemsCached !== null) {
          _items = _itemsCached;
        } else if (!angular.isArray(_items)) {
          _items = [];
        }

        if (_fields !== null){
          var _itemsLength = _items.length;
          var i = 0;
          for ( ; _itemsLength > i; i++) {
            _items[i] = this.createValueObject(_items[i]);
          }
        }
        CryptoOfflineStorageService.set(_key, _items);
        self.setListItems(_items, params);

        //  Extend params for create a factory in service
        return self;
      },
      createValueObject: function(item) {
        var obj = {};
        angular.forEach( _fields, function( field ) {
          obj[field] = item[field] || '';
        });
        return obj;
      },
      setKey: function(key){
        _key = key;
        return this;
      },
      getKey: function(){
        return _key;
      },
      setListItems: function(items){
        _items = items;
        return this;
      },
      getListItems: function(){
        return _items;
      },
      setFields: function(fields){
        _fields = fields;
        return this;
      },
      countTotalItems: function(items) {
        return ($filter('max')(items, '_id') || 0) + 1;
      },
      create: function (item) {
        item = this.createValueObject(item);
        item._id = this.countTotalItems(_items);
        _items.push(item);
        CryptoOfflineStorageService.set(_key, _items);
        return _items;
      },
      update: function (item) {
        _items = _items.map( function (element) {
          if ( element._id === item._id){
            element = item;
          }
          return element;
        });
        CryptoOfflineStorageService.set(_key, _items);
        return _items;
      },
      delete: function(index) {
        var db = this.getListItems();
        var _id = db.filter( function (element, pos) {
          if ( element._id === index){
            element.pos = pos;
            return element;
          }
        });

        if (_id.length > 0) {
          var item = db.splice(_id[0].pos, 1);
          if (typeof item[0] ===  'object') {
            this.setListItems(db);
            CryptoOfflineStorageService.set(_key, db);
            return item[0];
          }
        }
        return false;
      }
    };

  });
