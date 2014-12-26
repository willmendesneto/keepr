'use strict';

/**
 * Provide a Alert service for application
 * @class AlertService
 * @module services
 * @main AlertService
 * @class AlertService
 * @static
 */
angular.module('keepr.services')
  .service('AlertService', function AlertService($rootScope, $timeout) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    // create an array of alerts available globally
    $rootScope.alerts = [];

    var alertService = {

      /**
       * Add a alert in application
       * #### Example of use
       * <pre><code>AlertService.add('success', 'This is a alert with 5 seconds of lifetime!', 5000);</pre></code>
       * @param {String} type    alert type
       * @param {String} msg     alert message
       * @param {Integer} timeout alert lifetime
       * @method add
       */
      add: function(type, msg, timeout) {

        $rootScope.alerts.push({
          type: type,
          msg: msg
        });
        if (timeout) {
          var index = $rootScope.alerts.length - 1;
          $timeout(function(){
            alertService.closeAlertMessage(index);
          }, timeout);
        }
      },

      /**
       * Close a specific alert in application
       * #### Example of use
       * <pre><code>AlertService.closeAlertMessage(0);</pre></code>
       * @param  {Integer} index alert index in $rootScope.alerts array
       * @method closeAlertMessage
       * @return {Boolean}
       */
      closeAlertMessage: function(index) {
        return $rootScope.alerts.splice(index, 1);
      },

      /**
       * Clear all alert messages in application
       * #### Example of use
       * <pre><code>AlertService.clear();</pre></code>
       * @method clear
       */
      clear: function(){
        $rootScope.alerts = [];
      }
    };

    $rootScope.closeAlertMessage = alertService.closeAlertMessage;

    return alertService;
  });
