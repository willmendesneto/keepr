(function(window, angular, undefined){ "use strict";

angular.module('keepr.directives', []);
angular.module('keepr.filters', []);
angular.module('keepr.services', []);

angular.module('keepr', ['keepr.directives', 'keepr.filters', 'keepr.services']);



/**
 * Add flip content for images in aplication
 * @module directives
 * @main kpFlipContent
 * @class kpFlipContent
 * @static
 */
angular.module('keepr.directives')
  .directive('kpFlipContent', function () {

    /**
     * Controller to directive
     * #### Example of user
     * `<kp-flip-content data-click-toggle="true" data-mouseover-toggle="true">
     *    <kp-flip-content-front>
     *      <img src="images/yeoman.png" alt="the front" />
     *    </kp-flip-content-front>
     *    <kp-flip-content-back>
     *      <img src="images/yeoman.png" alt="the back" />
     *    </kp-flip-content-back>
     *  </kp-flip-content>`
     * @param  {kp-flip-content} Element/Attribute for element delimiter
     * @method kpFlipContent
     */
    return {
      restrict: 'EA',
      scope: {},
      link: function($scope, $elem, $attrs) {
        /**
         * behaviour for flipping effect.
         */
        var flip = function() {
          $elem.toggleClass('flipped');
        };

        if ($attrs.clickToggle) {
          $elem.bind('click', flip);
        }
        if ($attrs.mouseoverToggle) {
          $elem.bind('mouseenter mouseleave', flip);
        }

        $scope.$on('$destroy', function() {
          $elem.unbind('mouseenter mouseleave');
        });

      }
    };
  });



/**
 * Validate input element on focus/blur event
 *
 * @module directives
 * @main kpFocus
 * @static
 */
angular.module('keepr.directives')
  .directive('kpFocus', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, controller) {
        controller.$focused = false;

        /**
         * Activate directive on focus event
         * @return
         */
        element.bind('focus', function(){
          scope.$apply(function(){
            controller.$focused = true;
          });
        })

        /**
         * Deactivate directive on blur event
         * @return
         */
        .bind('blur', function(){
          scope.$apply(function(){
            controller.$focused = false;
          });
        });

        /**
         * Destroy events on "$destroy" scope event
         * @return
         */
        scope.$on('$destroy', function() {
          element.unbind('blur focus');
        });
      }
    };
  });

/*jshint bitwise: false*/


/**
 * Add masks in input fields based in mask string
 *
 * @module directives
 * @main kpMask
 * @static
 */
angular.module('keepr.directives')
  .directive('kpMask', function ($parse) {

    var maskConfig = {
      maskDefinitions : {
        '9': /\d/,
        'A': /[a-zA-Z]/,
        'g': /[a-z]/,
        'G': /[A-Z]/,
        '*': /[a-zA-Z0-9]/
      }
    };

    /**
     * Controller to directive
     * #### Example of user
     * `<input kp-mask="'(999).999-9999'" placeholder="(___).___-____" ng-model="x"></input>`
     * @param  {kp-mask} String with mask used in field
     * @method kpMask
     */
    return {
      priority: 100,
      require: 'ngModel',
      restrict: 'A',
      compile: function maskCompilingFunction(){
        var options = maskConfig;

        return function maskLinkingFunction(scope, iElement, iAttrs, controller){
          var maskProcessed = false, eventsBound = false,
            maskCaretMap, maskPatterns, maskPlaceholder, maskComponents,
          // Minimum required length of the value to be considered valid
            minRequiredLength,
            value, valueMasked, isValid,
          // Vars for initializing/uninitializing
            originalPlaceholder = iAttrs.placeholder,
            originalMaxlength = iAttrs.maxlength,
            cleanField = (!angular.isUndefined(iAttrs.kpCleanField) && iAttrs.kpCleanField === 'true'),
          // Vars used exclusively in eventHandler()
            oldValue, oldValueUnmasked, oldCaretPosition, oldSelectionLength;

          function initialize(maskAttr){
            if (!angular.isDefined(maskAttr)) {
              return uninitialize();
            }
            processRawMask(maskAttr);
            if (!maskProcessed) {
              return uninitialize();
            }
            initializeElement();
            bindEventListeners();
            return true;
          }

          /**
           * Initialyze field placeholder
           * @param  {string} placeholderAttr Placeholder string
           * @method initPlaceholder
           */
          function initPlaceholder(placeholderAttr) {
            if(! angular.isDefined(placeholderAttr)) {
              return;
            }

            maskPlaceholder = placeholderAttr;

            // If the mask is processed, then we need to update the value
            if (maskProcessed) {
              eventHandler();
            }
          }

          /**
           * Format field value based in mask
           * @param  {[type]} fromModelValue [description]
           * @return {[type]}                [description]
           * @method formatter
           */
          function formatter(fromModelValue){
            if (!maskProcessed) {
              return fromModelValue;
            }
            value = unmaskValue(fromModelValue || '');
            isValid = validateValue(value);
            controller.$setValidity('mask', isValid);
            return isValid && value.length ? maskValue(value) : undefined;
          }

          /**
           * [parser description]
           * @param  {String} fromViewValue Field view value
           * @return {String}
           * @method parser
           */
          function parser(fromViewValue){
            if (!maskProcessed) {
              return fromViewValue;
            }
            value = unmaskValue(fromViewValue || '');
            isValid = validateValue(value);
            // We have to set viewValue manually as the reformatting of the input
            // value performed by eventHandler() doesn't happen until after
            // this parser is called, which causes what the user sees in the input
            // to be out-of-sync with what the controller's $viewValue is set to.
            controller.$viewValue = value.length ? maskValue(value) : '';
            controller.$setValidity('mask', isValid);
            if (value === '' && controller.$error.required !== undefined) {
              controller.$setValidity('required', false);
            }
            return isValid ? value : undefined;
          }

          var linkOptions = {};

          if (iAttrs.uiOptions) {
            linkOptions = scope.$eval('[' + iAttrs.uiOptions + ']');
            if (angular.isObject(linkOptions[0])) {
              // we can't use angular.copy nor angular.extend, they lack the power to do a deep merge
              linkOptions = (function(original, current){
                for(var i in original) {
                  if (Object.prototype.hasOwnProperty.call(original, i)) {
                    if (!current[i]) {
                      current[i] = angular.copy(original[i]);
                    } else {
                      angular.extend(current[i], original[i]);
                    }
                  }
                }
                return current;
              })(options, linkOptions[0]);
            }
          } else {
            linkOptions = options;
          }

          iAttrs.$observe('kpMask', initialize);
          iAttrs.$observe('placeholder', initPlaceholder);
          var modelViewValue = false;
          iAttrs.$observe('modelViewValue', function(val) {
            if(val === 'true') {
              modelViewValue = true;
            }
          });
          scope.$watch(iAttrs.ngModel, function(val) {
            if(modelViewValue && val) {
              var model = $parse(iAttrs.ngModel);
              model.assign(scope, controller.$viewValue);
            }
          });
          controller.$formatters.push(formatter);
          controller.$parsers.push(parser);

          /**
           * Remove mask bind for field
           * @return {Boolean}
           * @method uninitialize
           */
          function uninitialize(){
            maskProcessed = false;
            unbindEventListeners();

            if (angular.isDefined(originalPlaceholder)) {
              iElement.attr('placeholder', originalPlaceholder);
            } else {
              iElement.removeAttr('placeholder');
            }

            if (angular.isDefined(originalMaxlength)) {
              iElement.attr('maxlength', originalMaxlength);
            } else {
              iElement.removeAttr('maxlength');
            }

            iElement.val(controller.$modelValue);
            controller.$viewValue = controller.$modelValue;
            return false;
          }

          /**
           * Initialize bind for element
           * @method initializeElement
           */
          function initializeElement(){
            value = oldValueUnmasked = unmaskValue(controller.$modelValue || '');
            valueMasked = oldValue = maskValue(value);
            isValid = validateValue(value);
            var viewValue = isValid && value.length ? valueMasked : '';
            if (iAttrs.maxlength) { // Double maxlength to allow pasting new val at end of mask
              iElement.attr('maxlength', maskCaretMap[maskCaretMap.length - 1] * 2);
            }
            iElement.attr('placeholder', maskPlaceholder);
            iElement.val(viewValue);

            controller.$viewValue = viewValue;
            // Not using $setViewValue so we don't clobber the model value and dirty the form
            // without any kind of user interaction.

            placeholderVerification();
          }

          /**
           * Initialyze bind EventListeners in element
           * @method bindEventListeners
           */
          function bindEventListeners(){
            if (eventsBound) {
              return;
            }
            iElement.bind('blur', blurHandler);
            iElement.bind('mousedown mouseup', mouseDownUpHandler);
            iElement.bind('input keyup click focus', eventHandler);
            eventsBound = true;
          }

          /**
           * Remove bind EventListeners in element
           * @method unbindEventListeners
           */
          function unbindEventListeners(){
            if (!eventsBound) {
              return;
            }
            iElement.unbind('blur', blurHandler);
            iElement.unbind('mousedown', mouseDownUpHandler);
            iElement.unbind('mouseup', mouseDownUpHandler);
            iElement.unbind('input', eventHandler);
            iElement.unbind('keyup', eventHandler);
            iElement.unbind('click', eventHandler);
            iElement.unbind('focus', eventHandler);
            eventsBound = false;
          }

          /**
           * Validate string value
           * @param  {String} value Field value
           * @return {Boolean}
           * @method validateValue
           */
          function validateValue(value){
            // Zero-length value validity is ngRequired's determination
            return value.length ? value.length >= minRequiredLength : true;
          }

          /**
           * Remove mask from field in view
           * @param  {String} value Field value
           * @return {string}      Value without mask
           * @method unmaskValue
           */
          function unmaskValue(value){
            var valueUnmasked = '',
              maskPatternsCopy = maskPatterns.slice();
            // Preprocess by stripping mask components from value
            value = value.toString();
            angular.forEach(maskComponents, function (component){
              value = value.replace(component, '');
            });
            angular.forEach(value.split(''), function (chr){
              if (maskPatternsCopy.length && maskPatternsCopy[0].test(chr)) {
                valueUnmasked += chr;
                maskPatternsCopy.shift();
              }
            });
            return valueUnmasked;
          }

          /**
           * Add mask from field in view
           * @param  {String} value Field value
           * @return {string}      Value without mask
           * @method maskValue
           */
          function maskValue(unmaskedValue){
            var valueMasked = '',
                maskCaretMapCopy = maskCaretMap.slice();

            angular.forEach(maskPlaceholder.split(''), function (chr, i){
              if (unmaskedValue.length && i === maskCaretMapCopy[0]) {
                valueMasked  += unmaskedValue.charAt(0) || '_';
                unmaskedValue = unmaskedValue.substr(1);
                maskCaretMapCopy.shift();
              } else {
                valueMasked += chr;
              }
            });
            return valueMasked;
          }

          function getPlaceholderChar(i) {
            var placeholder = iAttrs.placeholder;

            if (typeof placeholder !== 'undefined' && placeholder[i]) {
              return placeholder[i];
            } else {
              return '_';
            }
          }

          /**
           * Generate array of mask components that will be stripped from a masked value
           * before processing to prevent mask components from being added to the unmasked value.
           * E.g., a mask pattern of '+7 9999' won't have the 7 bleed into the unmasked value.
           * If a maskable char is followed by a mask char and has a mask
           * char behind it, we'll split it into it's own component so if
           * a user is aggressively deleting in the input and a char ahead
           * of the maskable char gets deleted, we'll still be able to strip
           * it in the unmaskValue() preprocessing.
           * @return {String} String formatted based in mask
           * @method getMaskComponents
           */
          function getMaskComponents() {
            return maskPlaceholder.replace(/[_]+/g, '_').replace(/([^_]+)([a-zA-Z0-9])([^_])/g, '$1$2_$3').split('_');
          }

          /**
           * Process raw mask
           * @param  {String} mask Mask string passed in field
           * @return {Boolean}
           * @method processRawMask
           */
          function processRawMask(mask){
            var characterCount = 0;

            maskCaretMap    = [];
            maskPatterns    = [];
            maskPlaceholder = '';

            if (typeof mask === 'string') {
              minRequiredLength = 0;

              var isOptional = false,
                  splitMask  = mask.split('');

              angular.forEach(splitMask, function (chr, i){
                if (linkOptions.maskDefinitions[chr]) {

                  maskCaretMap.push(characterCount);

                  maskPlaceholder += getPlaceholderChar(i);
                  maskPatterns.push(linkOptions.maskDefinitions[chr]);

                  characterCount++;
                  if (!isOptional) {
                    minRequiredLength++;
                  }
                }
                else if (chr === '?') {
                  isOptional = true;
                }
                else {
                  maskPlaceholder += chr;
                  characterCount++;
                }
              });
            }
            // Caret position immediately following last position is valid.
            maskCaretMap.push(maskCaretMap.slice().pop() + 1);

            maskComponents = getMaskComponents();
            maskProcessed  = maskCaretMap.length > 1 ? true : false;
          }

          /**
           * Add blur event for field
           * @method blurHandler
           */
          function blurHandler(){
            oldCaretPosition = 0;
            oldSelectionLength = 0;
            if ((!isValid || value.length === 0) && !!cleanField) {
              valueMasked = '';
              iElement.val('');
              scope.$apply(function (){
                controller.$setViewValue('');
              });
            }
          }

          /**
           * Add mousedown/mouseup event for field
           * @method mouseDownUpHandler
           */
          function mouseDownUpHandler(e){
            if (e.type === 'mousedown') {
              iElement.bind('mouseout', mouseoutHandler);
            } else {
              iElement.unbind('mouseout', mouseoutHandler);
            }
          }

          iElement.bind('mousedown mouseup', mouseDownUpHandler);

          /**
           * Add mouseout event for field
           * @method mouseoutHandler
           */
          function mouseoutHandler(){
            /*jshint validthis: true */
            oldSelectionLength = getSelectionLength(this);
            iElement.unbind('mouseout', mouseoutHandler);
          }

          /**
           * Add event handler for field
           * @method eventHandler
           */
          function eventHandler(e){
            /*jshint validthis: true */
            e = e || {};
            // Allows more efficient minification
            var eventWhich = e.which,
              eventType = e.type;

            // Prevent shift and ctrl from mucking with old values
            if (eventWhich === 16 || eventWhich === 91) { return;}

            var val = iElement.val(),
              valOld = oldValue,
              valMasked,
              valUnmasked = unmaskValue(val),
              valUnmaskedOld = oldValueUnmasked,
              valAltered = false,

              caretPos = getCaretPosition(this) || 0,
              caretPosOld = oldCaretPosition || 0,
              caretPosDelta = caretPos - caretPosOld,
              caretPosMin = maskCaretMap[0],
              caretPosMax = maskCaretMap[valUnmasked.length] || maskCaretMap.slice().shift(),

              selectionLenOld = oldSelectionLength || 0,
              isSelected = getSelectionLength(this) > 0,
              wasSelected = selectionLenOld > 0,

              // Case: Typing a character to overwrite a selection
              isAddition = (val.length > valOld.length) || (selectionLenOld && val.length > valOld.length - selectionLenOld),
              // Case: Delete and backspace behave identically on a selection
              isDeletion = (val.length < valOld.length) || (selectionLenOld && val.length === valOld.length - selectionLenOld),
              isSelection = (eventWhich >= 37 && eventWhich <= 40) && e.shiftKey, // Arrow key codes

              isKeyLeftArrow = eventWhich === 37,
              // Necessary due to "input" event not providing a key code
              isKeyBackspace = eventWhich === 8 || (eventType !== 'keyup' && isDeletion && (caretPosDelta === -1)),
              isKeyDelete = eventWhich === 46 || (eventType !== 'keyup' && isDeletion && (caretPosDelta === 0 ) && !wasSelected),

              // Handles cases where caret is moved and placed in front of invalid maskCaretMap position. Logic below
              // ensures that, on click or leftward caret placement, caret is moved leftward until directly right of
              // non-mask character. Also applied to click since users are (arguably) more likely to backspace
              // a character when clicking within a filled input.
              caretBumpBack = (isKeyLeftArrow || isKeyBackspace || eventType === 'click') && caretPos > caretPosMin;

            oldSelectionLength = getSelectionLength(this);

            // These events don't require any action
            if (isSelection || (isSelected && (eventType === 'click' || eventType === 'keyup'))) {
              return;
            }

            // Value Handling
            // ==============

            // User attempted to delete but raw value was unaffected--correct this grievous offense
            if ((eventType === 'input') && isDeletion && !wasSelected && valUnmasked === valUnmaskedOld) {
              while (isKeyBackspace && caretPos > caretPosMin && !isValidCaretPosition(caretPos)) {
                caretPos--;
              }
              while (isKeyDelete && caretPos < caretPosMax && maskCaretMap.indexOf(caretPos) === -1) {
                caretPos++;
              }
              var charIndex = maskCaretMap.indexOf(caretPos);
              // Strip out non-mask character that user would have deleted if mask hadn't been in the way.
              valUnmasked = valUnmasked.substring(0, charIndex) + valUnmasked.substring(charIndex + 1);
              valAltered = true;
            }

            // Update values
            valMasked = maskValue(valUnmasked);

            oldValue = valMasked;
            oldValueUnmasked = valUnmasked;
            iElement.val(valMasked);
            if (valAltered) {
              // We've altered the raw value after it's been $digest'ed, we need to $apply the new value.
              scope.$apply(function (){
                controller.$setViewValue(valUnmasked);
              });
            }

            // Caret Repositioning
            // ===================

            // Ensure that typing always places caret ahead of typed character in cases where the first char of
            // the input is a mask char and the caret is placed at the 0 position.
            if (isAddition && (caretPos <= caretPosMin)) {
              caretPos = caretPosMin + 1;
            }

            if (caretBumpBack) {
              caretPos--;
            }

            // Make sure caret is within min and max position limits
            caretPos = caretPos > caretPosMax ? caretPosMax : caretPos < caretPosMin ? caretPosMin : caretPos;

            // Scoot the caret back or forth until it's in a non-mask position and within min/max position limits
            while (!isValidCaretPosition(caretPos) && caretPos > caretPosMin && caretPos < caretPosMax) {
              caretPos += caretBumpBack ? -1 : 1;
            }

            if ((caretBumpBack && caretPos < caretPosMax) || (isAddition && !isValidCaretPosition(caretPosOld))) {
              caretPos++;
            }
            oldCaretPosition = caretPos;
            setCaretPosition(this, caretPos);

            placeholderVerification();
          }

          /**
           * Verification for set placeholder based in "kpPlaceholder" attribute's directive
           *
           * @return {[type]} [description]
           */
          function placeholderVerification() {
            value = unmaskValue(controller.$viewValue || '');
            iElement.attr('placeholder', ((value.length > 0) ? maskPlaceholder : iAttrs.kpPlaceholder ));
          }

          /**
           * Verify if element exists and if is accept in mask
           * @param  {String}  pos
           * @return {Boolean}
           * @method isValidCaretPosition
           */
          function isValidCaretPosition(pos){
            return maskCaretMap.indexOf(pos) > -1;
          }

          /**
           * Get Caret Position
           * @param  {String} input Value of field
           * @return {Integer}       caret position in field value
           * @method getCaretPosition
           */
          function getCaretPosition(input){
            if (!input) {
              return 0;
            }
            if (input.selectionStart !== undefined) {
              return input.selectionStart;
            } else if (document.selection) {
              // Curse you IE
              input.focus();
              var selection = document.selection.createRange();
              selection.moveStart('character', input.value ? -input.value.length : 0);
              return selection.text.length;
            }
            return 0;
          }

          /**
           * Set Caret Position
           * @param  {String} input Value of field
           * @param  {String} pos Position of Value's field
           * @return {Integer}       caret position in field value
           * @method setCaretPosition
           */
          function setCaretPosition(input, pos){
            if (!input) {
              return 0;
            }
            if (input.offsetWidth === 0 || input.offsetHeight === 0) {
              return; // Input's hidden
            }
            if (input.setSelectionRange) {
              input.focus();
              input.setSelectionRange(pos, pos);
            }
            else if (input.createTextRange) {
              // Curse you IE
              var range = input.createTextRange();
              range.collapse(true);
              range.moveEnd('character', pos);
              range.moveStart('character', pos);
              range.select();
            }
          }

          /**
           * Get Selection Length
           * @param  {String} input Value of field
           * @return {Integer}
           * @method getSelectionLength
           */
          function getSelectionLength(input){
            if (!input) {
              return 0;
            }
            if (input.selectionStart !== undefined) {
              return (input.selectionEnd - input.selectionStart);
            }
            if (document.selection) {
              return (document.selection.createRange().text.length);
            }
            return 0;
          }

          // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
          if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (searchElement /*, fromIndex */){
              if (this === null) {
                throw new TypeError();
              }
              var t = Object(this);
              var len = t.length >>> 0;
              if (len === 0) {
                return -1;
              }
              var n = 0;
              if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n !== n) { // shortcut for verifying if it's NaN
                  n = 0;
                } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                  n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
              }
              if (n >= len) {
                return -1;
              }
              var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
              for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                  return k;
                }
              }
              return -1;
            };
          }

        };
      }
    };

  });

/* globals alert */


angular.module('keepr.directives')
  //  <button type="button" print-content print-target="#target" class="btn btn-primary">Imprimir</button>
  // <div id="target"><p>Exemplo</p></div>
  .directive('kpPrintContent', function () {
    return {
      restrict: 'A',
      scope: {
        printOptions: '=printOptions'
      },
      link: {
        post: function postLink($scope, $el) {
          var printOptions = {
            removeBind: false,
            target: 'body',
            title: 'Print',
            alert: true,
            css: []
          };

          angular.extend(printOptions, $scope.printOptions);

          if (!!$scope.printOptions.removeBind) {
            $el.removeClass('ng-binding ng-scope');
          }

          $scope.$on('$destroy', function () {
            $scope.$destroy();
            $el.unbind('click');
          });

          $el.bind('click', function () {
            var $target = angular.element($scope.printOptions.target);
            // NOTE: We are trimming the jQuery collection down to the
            // first element in the collection.
            if ($target.size() > 1) {
              $target.eq(0).print();
              return false;
            } else if (!$target.size()) {
              if (!!$scope.printOptions.alert) {
                alert('Target not specified!');
              }
              return false;
            }

            // ASSERT: At this point, we know that the current jQuery
            // collection (as defined by THIS), contains only one
            // printable element.

            // Create a random name for the print frame.
            var strFrameName = ('printer-' + (new Date()).getTime());

            // Create an iFrame with the new name.
            var jFrame = angular.element('<iframe name="' + strFrameName + '">');

            // Hide the frame (sort of) and attach to the body.
            jFrame
                .css('width', '1px')
                .css('height', '1px')
                .css('position', 'absolute')
                .css('left', '-9999px')
                .appendTo(angular.element('body:first'))
            ;

            // Get a FRAMES reference to the new frame.
            var objFrame = window.frames[strFrameName];

            // Get a reference to the DOM in the new frame.
            var objDoc = objFrame.document;

            // Grab all the style tags and copy to the new
            // document so that we capture look and feel of
            // the current document.

            // Create a temp document DIV to hold the style tags.
            // This is the only way I could find to get the style
            // tags into IE.
            var jStyleDiv = angular.element('<div>').append(
                angular.element('style').clone()
              );

            // Write the HTML for the document. In this, we will
            // write out the HTML of the current element.
            objDoc.open();
            objDoc.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">');
            objDoc.write('<html>');
            objDoc.write('<body>');
            objDoc.write('<head>');
            objDoc.write('<title>');
            objDoc.write($scope.printOptions.title || document.title);
            if ($scope.printOptions.css.length > 0) {
              angular.forEach($scope.printOptions.css, function (stylesheet) {
                objDoc.write('<link href="' + stylesheet + '" rel="stylesheet"/>');
              });
            }
            objDoc.write('</title>');
            objDoc.write(jStyleDiv.html());
            objDoc.write('</head>');
            objDoc.write($target.html());
            objDoc.write('</body>');
            objDoc.write('</html>');
            objDoc.close();

            // Print the document.
            objFrame.focus();
            objFrame.print();

            // Have the frame remove itself in about a minute so that
            // we don't build up too many of these frames.
            setTimeout(function () {
              jFrame.remove();
              return true;
            }, (60 * 1000));
          });
        }
      }
    };
  });



/**
 * Provide camelcase filter for application
 * @class camelCase
 * @module filters
 * @main camelCase
 * @class camelCase
 * @static
 */
angular.module('keepr.filters')
  .filter('camelCase', ['$filter', function ($filter) {
    return function (input, firstWordWithCase) {
      if (input === null || input === undefined) {
        input = '';
      }

      var $trim = $filter('trim');
      //  First character with camel case
      if (!!firstWordWithCase) {
        input = $filter('capitalize')(input);
      }

      return $trim(input).replace(/[-_\s]+(.)?/g, function(match, c) {
        return c.toUpperCase();
      });
    };
  }]);



/**
 * Provide capitalize filter for application
 * @class capitalize
 * @module filters
 * @main capitalize
 * @class capitalize
 * @static
 */
angular.module('keepr.filters')
  .filter('capitalize', function () {
    return function (input) {
      var str;
      if (input === undefined || input === null) {
        input = '';
      }
      str = String(input);
      return str.charAt(0).toUpperCase() + str.substring(1);
    };
  });



/**
 * Returns string filtered based in characters quantity + suffix
 * @class charactersQuantity
 * @module filters
 * @main charactersQuantity
 * @class charactersQuantity
 * @static
 */
angular.module('keepr.filters')
  .filter('charactersQuantity', function () {
    return function (input, chars, breakOnWord) {
      if (isNaN(chars)) {
        return input;
      }
      if (chars <= 0) {
        return '';
      }
      if (input && input.length > chars) {
        input = input.substring(0, chars);

        if (!breakOnWord) {
          var lastspace = input.lastIndexOf(' ');
          //get last space
          if (lastspace !== -1) {
            input = input.substr(0, lastspace);
          }
        }else{
          while(input.charAt(input.length-1) === ' '){
            input = input.substr(0, input.length -1);
          }
        }
        return input + '...';
      }
      return input;
    };
  });



/**
 * Returns string conditional based in params passed for application
 * Example:
 * <a ng-href="{{ isProduct | conditional:'/product/':'/user/'}}{{object.id}}">My Object</a>
 * @class conditional
 * @module filters
 * @main conditional
 * @class conditional
 * @static
 */
angular.module('keepr.filters')
  .filter('conditional', function () {
    return function(input, trueCase, falseCase) {
      return input === trueCase ? trueCase : falseCase;
    };
  });



/**
 * Returns string encoded based in URI params
 * Example:
 * <a ng-href="/product/{{product.id}}?from={{'/products' | encodeUri}}">Go To Individual Product Page</a></p>
 * @class encodeUri
 * @module filters
 * @main encodeUri
 * @class encodeUri
 * @static
 */
angular.module('keepr.filters')
  .filter('encodeUri', function () {
    return function (input) {
      if (input === undefined || input === null) {
        return '';
      }
      return encodeURIComponent(input);
    };
  });



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



/**
 * Returns string list + string separator based in string value
 * @class list
 * @module filters
 * @main list
 * @class list
 * @static
 */
angular.module('keepr.filters')
  .filter('list', function () {
    return function (input, separator) {
      if (separator === null || separator === undefined) {
        separator = ', ';
      }
      return input.join(separator);
    };
  });



/**
 * Returns maximum value based in string value
 * @class max
 * @module filters
 * @main max
 * @class max
 * @static
 */
angular.module('keepr.filters')
  .filter('max', function () {
    return function (input, elementKey) {
      var out;
      if (!input) {
        return;
      }
      if (elementKey === undefined || elementKey === null) {
        elementKey = false;
      }
      for (var i in input) {
        if (!elementKey) {
          if (input[i] > out || out === undefined || out === null) {
            out = input[i];
          }
        } else {
          if (typeof input[i][elementKey] !== 'undefined' && (input[i][elementKey] > out || out === undefined || out === null)) {
            out = input[i][elementKey];
          }
        }
      }
      return out;
    };
  });



/**
 * Returns minimum value based in string value
 * @class min
 * @module filters
 * @main min
 * @class min
 * @static
 */
angular.module('keepr.filters')
  .filter('min', function () {
    return function (input) {
      var out;
      if (!input) {
        return;
      }
      for (var i in input) {
        if (input[i] < out || out === undefined || out === null) {
          out = input[i];
        }
      }
      return out;
    };
  });



/**
 * Returns string in snakeCase format based in param
 * @class snakeCase
 * @module filters
 * @main snakeCase
 * @class snakeCase
 * @static
 */
angular.module('keepr.filters')
  .filter('snakeCase', ['$filter', function ($filter) {
    return function (input) {
      if (input === null || input === undefined) {
        input = '';
      }
      var $trim = $filter('trim');
      return $trim(input).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
    };
  }]);



/**
 * Returns the first value for "limit" method creation
 * @class startFrom
 * @module filters
 * @main startFrom
 * @class startFrom
 * @static
 */
angular.module('keepr.filters')
  .filter('startFrom', function () {
    return function(input, start) {
      start = +start; //parse to int
      return (typeof input === 'object' && input.length > 0 ) ? input.slice(start) : [];
    };
  });



/**
 * Returns string without spaces based in param
 * @class trim
 * @module filters
 * @main trim
 * @class trim
 * @static
 */
angular.module('keepr.filters')
  .filter('trim', function () {
    return function (input) {
      var str;
      if (input === undefined || input === null) {
        input = '';
      }
      str = String(input);
      if (String.prototype.trim !== null) {
        return str.trim();
      } else {
        return str.replace(/^\s+|\s+$/gm, '');
      }
    };
  });



/**
 * Returns string with first character in lower case
 * @class uncapitalize
 * @module filters
 * @main uncapitalize
 * @class uncapitalize
 * @static
 */
angular.module('keepr.filters')
  .filter('uncapitalize', function () {
    return function (input) {
      var str;
      if (input === undefined || input === null) {
        input = '';
      }
      str = String(input);
      return str.charAt(0).toLowerCase() + str.substring(1);
    };
  });



/**
 * Filter array and returns unique values in array
 * @class unique
 * @module filters
 * @main unique
 * @class unique
 * @static
 */
angular.module('keepr.filters')
  .filter('unique', ['$parse', function ($parse) {

    return function (items, filterOn) {

      if (filterOn === false) {
        return items;
      }

      if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
        var newItems = [],
          get = angular.isString(filterOn) ? $parse(filterOn) : function (item) { return item; };

        var extractValueToCompare = function (item) {
          return angular.isObject(item) ? get(item) : item;
        };

        angular.forEach(items, function (item) {
          var isDuplicate = false;

          for (var i = 0; i < newItems.length; i++) {
            if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
              isDuplicate = true;
              break;
            }
          }
          if (!isDuplicate) {
            newItems.push(item);
          }

        });
        items = newItems;
      }
      return items;
    };
  }]);



/**
 * Filter used for Email valid verificattion
 * @class validateEmail
 * @module filters
 * @main validateEmail
 * @class validateEmail
 * @static
 */
angular.module('keepr.filters')
  .filter('validateEmail', function () {
    return function (input) {
      if (input === null || input === undefined) {
        return false;
      }
      var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return emailRegex.test(input);
    };
  });



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

/* globals JSON, CryptoJS */


/**
 * Provide a service for Crypt/Decrypt offline storage (localStorage/sessionStorage) data in application
 * @class CryptoOfflineStorageService
 * @module services
 * @main CryptoOfflineStorageService
 * @class CryptoOfflineStorageService
 * @static
 */
angular.module('keepr.services')
  .service('CryptoOfflineStorageService', function CryptoOfflineStorageService() {
    var loadCrypto = typeof CryptoJS !== 'undefined';

    return {

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
        angular.extend(this, opts);
      },

      /**
       * Encrypt object values
       * @param  {Object} object Object for encrypt
       * @param  {String} secret Secret key for encrypt
       * @return {String}        String with encrypted values
       * @method encrypt
       */
      encrypt: function(object, secret) {
        var message = loadCrypto ? JSON.stringify(object) : object;
        return loadCrypto ? CryptoJS.TripleDES.encrypt(message, secret) : JSON.stringify(object);
      },

      /**
       * Decrypt object values
       * @param  {Object} object Object for decrypt
       * @param  {String} secret Secret key for encrypt
       * @return {String}           Decrypted string
       * @method decrypt
       */
      decrypt: function(encrypted, secret) {
        if (typeof encrypted === 'undefined') {
          return '';
        }
        var decrypted = loadCrypto ? CryptoJS.TripleDES.decrypt(encrypted, secret) : JSON.parse(encrypted);
        return loadCrypto ? JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)) : decrypted;
      },

      /**
       * Get element values in offline storage (localStorage/sessionStorage)
       * @param  {String} secret Secret key for encrypt
       * @return {String}           Decrypted string
       * @method get
       */
      get: function(key) {
        var encrypted = window[this.storageType].getItem(key);
        return encrypted && this.decrypt(encrypted, this.secret);
      },

      /**
       * Set element values in offline storage (localStorage/sessionStorage)
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
      //
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

/*globals window*/


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
})(window, window.angular);