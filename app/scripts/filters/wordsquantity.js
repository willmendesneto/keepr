'use strict';

/**
 * Filter string for returns string with words quantitu specified
 * @class wordsQuantity
 * @module filters
 * @main wordsQuantity
 * @class wordsQuantity
 * @static
 */
angular.module('keepr.filters')
  .filter('wordsQuantity', function () {
    return function (input, words) {
      if (isNaN(words)){
        return input;
      }
      if (words <= 0){
        return '';
      }
      if (input) {
        var inputWords = input.split(/\s+/);
        if (inputWords.length > words) {
          input = inputWords.slice(0, words).join(' ') + '...';
        }
      }
      return input;
    };
  });
