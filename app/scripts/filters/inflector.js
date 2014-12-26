'use strict';

/**
 * Returns string filtered based in URI params
 * @class inflector
 * @module filters
 * @main inflector
 * @class inflector
 * @static
 */
angular.module('keepr.filters')
  .filter('inflector', function () {

    /**
     * Returns string with first words characted in uppercase
     * @param  {String} text Value for filter
     * @return {String}
     * @method ucwords
     */
    function ucwords(text) {
      return text.replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
      });
    }

    function breakup(text, separator) {
      return text.replace(/[A-Z]/g, function (match) {
        return separator + match;
      });
    }

    var inflectors = {

      /**
       * Returns string humanized
       * @param  {String} text Value for filter
       * @return {String}
       * @method humanize
       */
      humanize: function (value) {
        return ucwords(breakup(value, ' ').split('_').join(' '));
      },

      /**
       * Returns string with underscore
       * @param  {String} text Value for filter
       * @return {String}
       * @method underscore
       */
      underscore: function (value) {
        return value.substr(0, 1).toLowerCase() + breakup(value.substr(1), '_').toLowerCase().split(' ').join('_');
      },

      /**
       * Returns string with underscore and ' ' strings, in this order
       * @param  {String} text Value for filter
       * @return {String}
       * @method variable
       */
      variable: function (value) {
        value = value.substr(0, 1).toLowerCase() + ucwords(value.split('_').join(' ')).substr(1).split(' ').join('');
        return value;
      }
    };

    return function (input, inflector) {
      if (inflector !== false && angular.isString(input)) {
        inflector = inflector || 'humanize';
        return inflectors[inflector](input);
      } else {
        return input;
      }
    };
  });
