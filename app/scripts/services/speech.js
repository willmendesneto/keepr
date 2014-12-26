/*globals window*/
'use strict';

/**
 * Provide a HTML5 Speech service in application
 * @class Speech
 * @module services
 * @main Speech
 * @class Speech
 * @static
 */
angular.module('keepr.services')
  .factory('Speech', function () {
    // Service logic
    // ...
    var msg;
    if(window.speechSynthesis) {
      msg = new window.SpeechSynthesisUtterance();

      //calling get voices method first scaffolds it for
      //use in say method
      window.speechSynthesis.getVoices();
    }

    // Public API here
    return {

      /**
       * Message configurations
       * @property _msg
       * @type {Object}
       */
      _msg: msg,

      /**
       * Read string and talk content for user
       * @param  {String} text   Text content for talk content for user
       * @param  {Object} config Configuration options
       * @return {Boolean}
       * @method sayText
       */
      sayText: function(text, config) {
        var voices = window.speechSynthesis.getVoices();

        //choose voice. Fallback to default
        this._msg.voice = config.voiceIndex !== undefined ? voices[config.voiceIndex] : voices[0];
        this._msg.volume = config.volume !== undefined ? config.volume : 1;
        this._msg.rate = config.rate !== undefined ? config.rate : 1;
        this._msg.pitch = config.pitch !== undefined ? config.pitch : 1;

        //message for speech
        this._msg.text = text;

        window.speechSynthesis.speak(this._msg);

        return true;
      }
    };
  });
