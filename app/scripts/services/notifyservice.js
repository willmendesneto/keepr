'use strict';

/**
 * Provide a HTML5 Nitification service for intercept application messages
 * @class NotifyService
 * @module services
 * @main NotifyService
 * @class NotifyService
 * @static
 */
angular.module('keepr.services')
  .service('NotifyService', function NotifyService($rootScope) {

    var baseNotification = function() {
      /*
       Safari native methods required for Notifications do NOT run in strict mode.
       */
      //"use strict";
      var PERMISSION_DEFAULT = 'default',
        PERMISSION_GRANTED = 'granted',
        PERMISSION_DENIED = 'denied',
        PERMISSION = [PERMISSION_GRANTED, PERMISSION_DEFAULT, PERMISSION_DENIED],
        defaultSetting = {
          pageVisibility: false,
          autoClose: 0
        },
        empty = {},
        emptyString = '',
        isSupported = (function () {
          var isSupported = false;
          /*
           * Use try {} catch() {} because the check for IE may throws an exception
           * if the code is run on browser that is not Safar/Chrome/IE or
           * Firefox with html5notifications plugin.
           *
           * Also, we canNOT detect if msIsSiteMode method exists, as it is
           * a method of host object. In IE check for existing method of host
           * object returns undefined. So, we try to run it - if it runs
           * successfully - then it is IE9+, if not - an exceptions is thrown.
           */
          try {
            isSupported = !!(/* Safari, Chrome */window.Notification || /* Chrome & ff-html5notifications plugin */window.webkitNotifications || /* Firefox Mobile */navigator.mozNotification || /* IE9+ */(window.external && window.external.msIsSiteMode() !== undefined));
          } catch(e) {
            console.error(e.message);
          }
          return isSupported;
        }()),
        ieVerification = Math.floor((Math.random() * 10) + 1),
        isFunction = function (value) { return (value && (value).constructor === Function); },
        isString = function (value) {return (value && (value).constructor === String); },
        isObject = function (value) {return (value && (value).constructor === Object); },


        /**
         * Dojo Mixin
         */
        mixin = function (target, source) {
          var name, s;
          for (name in source) {
            s = source[name];
            if (!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))) {
              target[name] = s;
            }
          }
          return target; // Object
        },
        noop = function () {},
        settings = defaultSetting
      ;

      /**
       * Get HTML5 notification
       * @param  {String} title   Notification Title
       * @param  {Object} options JSON Object options
       * @return {Object}         Notification object
       * @method getNotification
       */
      function getNotification(title, options) {
        var notification;
        if (window.Notification) { /* Safari 6, Chrome (23+) */
          notification =  new window.Notification(title, {
            /* The notification's icon - For Chrome in Windows, Linux & Chrome OS */
            icon: isString(options.icon) ? options.icon : options.icon.x32,
            /* The notificationâ€™s subtitle. */
            body: options.body || emptyString,
            /*
                The notificationâ€™s unique identifier.
                This prevents duplicate entries from appearing if the user has multiple instances of your website open at once.
            */
            tag: options.tag || emptyString
          });
        } else if (window.webkitNotifications) { /* FF with html5Notifications plugin installed */
          notification = window.webkitNotifications.createNotification(options.icon, title, options.body);
          notification.show();
        } else if (navigator.mozNotification) { /* Firefox Mobile */
          notification = navigator.mozNotification.createNotification(title, options.body, options.icon);
          notification.show();
        } else if (window.external && window.external.msIsSiteMode()) { /* IE9+ */
          //Clear any previous notifications
          window.external.msSiteModeClearIconOverlay();
          window.external.msSiteModeSetIconOverlay((isString(options.icon) ? options.icon : options.icon.x16), title);
          window.external.msSiteModeActivate();
          notification = {
            ieVerification: ieVerification + 1
          };
        }
        return notification;
      }

      /**
       * Returns a lambda wrapper with close method
       * @param  {object} notification Notification Object
       * @return {Object}
       * @method getWrapper
       */
      function getWrapper(notification) {
        return {
          close: function () {
            if (notification) {
              if (notification.close) {
                //http://code.google.com/p/ff-html5notifications/issues/detail?id=58
                notification.close();
              } else if (window.external && window.external.msIsSiteMode()) {
                if (notification.ieVerification === ieVerification) {
                  window.external.msSiteModeClearIconOverlay();
                }
              }
            }
          }
        };
      }

      /**
       * Request HTML5 Notification permission in application
       * @param  {Function} callback Callback function
       * @method requestPermission
       */
      function requestPermission(callback) {
        if (!isSupported) {
          return;
        }
        var callbackFunction = isFunction(callback) ? callback : noop;
        if (window.webkitNotifications && window.webkitNotifications.checkPermission) {
          /*
           * Chrome 23 supports window.Notification.requestPermission, but it
           * breaks the browsers, so use the old-webkit-prefixed
           * window.webkitNotifications.checkPermission instead.
           *
           * Firefox with html5notifications plugin supports this method
           * for requesting permissions.
           */
          window.webkitNotifications.requestPermission(callbackFunction);
        } else if (window.Notification && window.Notification.requestPermission) {
          window.Notification.requestPermission(callbackFunction);
        }
      }

      /**
       * Returns HTML5 application level permission
       * @return {String} permission level
       * @method permissionLevel
       */
      function permissionLevel() {
        var permission;
        if (!isSupported) {
          return;
        }
        if (window.Notification && window.Notification.permissionLevel) {
          //Safari 6
          permission = window.Notification.permissionLevel();
        } else if (window.webkitNotifications && window.webkitNotifications.checkPermission) {
          //Chrome & Firefox with html5-notifications plugin installed
          permission = PERMISSION[window.webkitNotifications.checkPermission()];
        } else if (navigator.mozNotification) {
          //Firefox Mobile
          permission = PERMISSION_GRANTED;
        } else if (window.Notification && window.Notification.permission) {
          // Firefox 23+
          permission = window.Notification.permission;
        } else if (window.external && window.external.msIsSiteMode() !== undefined) { /* keep last */
          //IE9+
          permission = window.external.msIsSiteMode() ? PERMISSION_GRANTED : PERMISSION_DEFAULT;
        }
        return permission;
      }

      /**
       * HTML5 Notification configurations
       * @param  {Object} params Params definitions for HTML5 Notification
       * @return {Object}
       * @method config
       */
      function config(params) {
        if (params && isObject(params)) {
          mixin(settings, params);
        }
        return settings;
      }

      /**
       * Verify if document is hidden
       * @return {Boolean}
       * @method isDocumentHidden
       */
      function isDocumentHidden() {
        return settings.pageVisibility ? (document.hidden || document.msHidden || document.mozHidden || document.webkitHidden) : true;
      }

      /**
       * Create HTML5 Notification in application
       * @param  {String} title   Notification title
       * @param  {Object} options Notification configurations options
       * @return {Object}         Notification object
       */
      function createNotification(title, options) {
        var notification,
            notificationWrapper;
        /*
            Return undefined if notifications are not supported.
            Return undefined if no permissions for displaying notifications.
            Title and icons are required. Return undefined if not set.
         */
        if (isSupported && isDocumentHidden() && isString(title) && (options && (isString(options.icon) || isObject(options.icon))) && (permissionLevel() === PERMISSION_GRANTED)) {
          notification = getNotification(title, options);
        }
        notificationWrapper = getWrapper(notification);
        //Auto-close notification
        if (settings.autoClose && notification && !notification.ieVerification && notification.addEventListener) {
          notification.addEventListener('show', function () {
            var notification = notificationWrapper;
            window.setTimeout(function () {
              notification.close();
            }, settings.autoClose);
          });
        }
        return notificationWrapper;
      }

      var BaseNotification = {
        PERMISSION_DEFAULT: PERMISSION_DEFAULT,
        PERMISSION_GRANTED: PERMISSION_GRANTED,
        PERMISSION_DENIED: PERMISSION_DENIED,
        isSupported: isSupported,
        config: config,
        createNotification: createNotification,
        permissionLevel: permissionLevel,
        requestPermission: requestPermission
      };
      if (isFunction(Object.seal)) {
        Object.seal(BaseNotification);
      }

      // Return the public API.
      return BaseNotification;
    };

    var BaseNotification = baseNotification();

    // AngularJS will instantiate a singleton by calling "new" on this function
    var statusClass = {},
      isIE = false,
      isSupported = BaseNotification.isSupported,
      messages = {
        notPinned: 'Pin current page in the taskbar in order to receive notifications',
        notSupported: '<strong>Desktop Notifications not supported!</strong> Check supported browsers table and project\'s GitHub page.'
      };

    $rootScope.notification = {
      title: 'Notification Title',
      body: 'Notification Body',
      icon: 'img/beauthumb.jpg'
    };
    $rootScope.permissionLevel = BaseNotification.permissionLevel();
    $rootScope.permissionsGranted = ($rootScope.permissionLevel === BaseNotification.PERMISSION_GRANTED);

    try {
      isIE = (window.external && window.external.msIsSiteMode() !== undefined);
    } catch (e) {}

    statusClass[BaseNotification.PERMISSION_DEFAULT] = 'alert';
    statusClass[BaseNotification.PERMISSION_GRANTED] = 'alert alert-success';
    statusClass[BaseNotification.PERMISSION_DENIED] = 'alert alert-error';

    messages[BaseNotification.PERMISSION_DEFAULT] = '<strong>Warning!</strong> Click to allow displaying desktop notifications.';
    messages[BaseNotification.PERMISSION_GRANTED] = '<strong>Success!</strong>';
    messages[BaseNotification.PERMISSION_DENIED] = '<strong>Denied!</strong>';

    $rootScope.status = isSupported ? statusClass[$rootScope.permissionLevel] : statusClass[BaseNotification.PERMISSION_DENIED];
    $rootScope.message = isSupported ? (isIE ? messages.notPinned : messages[$rootScope.permissionLevel]) : messages.notSupported;

    $rootScope.requestPermission = function() {
      if ($rootScope.permissionLevel === BaseNotification.PERMISSION_DEFAULT) {
        BaseNotification.requestPermission(function() {
          $rootScope.$apply($rootScope.permissionLevel = BaseNotification.permissionLevel());
          $rootScope.$apply($rootScope.permissionsGranted = ($rootScope.permissionLevel === BaseNotification.PERMISSION_GRANTED));
          $rootScope.$apply($rootScope.status = isSupported ? statusClass[$rootScope.permissionLevel] : statusClass[BaseNotification.PERMISSION_DENIED]);
          $rootScope.$apply($rootScope.message = isSupported ? (isIE ? messages.notPinned : messages[$rootScope.permissionLevel]) : messages.notSupported);
        });
      }
    };

    $rootScope.showNotification = function(title, body, icon) {
      BaseNotification.createNotification(title, {
        body: body,
        icon: ((icon !== undefined) ? icon : $rootScope.notification.icon)
      });
    };

    return $rootScope;
  });
