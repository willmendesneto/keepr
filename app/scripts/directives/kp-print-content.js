'use strict';

angular.module('keepr.directives')
  // <button type="button" kp-print-content print-options="{}" class="btn btn-primary">Print</button>
  // <div id="target"><p>Content to print</p></div>
  .directive('kpPrintContent', function ($window) {
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
            tryWindowPrint: true,
            alert: true,
            css: []
          };

          angular.extend(printOptions, $scope.printOptions);

          if (!!printOptions.removeBind) {
            $el.removeClass('ng-binding ng-scope');
          }

          $scope.$on('$destroy', function () {
            $scope.$destroy();
            $el.unbind('click');
          });

          $el.bind('click', function () {
            if (printOptions.tryWindowPrint && window && 'print' in window) {
              $window.print();
              return;
            }

            function trim(content) {
              return content.replace(/^\s+|\s+$/g, '');
            }
            function replaceToHTMLEntities(content) {
              var newContent = content.replace(/&quot;/g, '"')
                                      .replace(/&amp;/g, '&')
                                      .replace(/&gt;/g, '>')
                                      .replace(/&lt;/g, '<');
              return newContent;
            }
            var targetHtml = [];
            var targets = [];
            if (printOptions.target.indexOf(',') !== -1) {
              targets = printOptions.target.split(',');
            } else {
              targets.push(printOptions.target);
            }

            targetHtml = targets.map(function(el){
              return angular.element(trim(el)).parent().html();
            }).join('');

            targetHtml = replaceToHTMLEntities(targetHtml);

            // NOTE: We are trimming the jQuery collection down to the
            // first element in the collection.
            if (targetHtml === '') {
              if (!!printOptions.alert) {
                $window.alert('Target not specified!');
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
            objDoc.write(printOptions.title || document.title);
            objDoc.write('</title>');

            if (printOptions.css.length > 0) {
              angular.forEach(printOptions.css, function (stylesheet) {
                objDoc.write('<link href="' + stylesheet + '" rel="stylesheet"/>');
              });
            }

            objDoc.write(jStyleDiv.html());
            objDoc.write('</head><body>');
            objDoc.write(targetHtml);
            objDoc.write('</body>');
            objDoc.write('</html>');
            objDoc.close();

            // Print the document.
            setTimeout(function(){
              objFrame.focus();
              objFrame.print();
            }, 1000);


            // Have the frame remove itself in about a minute so that
            // we don't build up too many of these frames.
            setTimeout(function () {
              jFrame.remove();
              return true;
            }, 2000);
          });
        }
      }
    };
  });
