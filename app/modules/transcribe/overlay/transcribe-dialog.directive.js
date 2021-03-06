'use strict';

var angular = require('angular');
var Draggabilly = require('draggabilly');

require('./overlay.module.js')
    .directive('transcribeDialog', transcribeDialog);

// @ngInject
function transcribeDialog($rootScope, $timeout, AnnotationsFactory, hotkeys, MarkingSurfaceFactory) {
    var directive = {
        link: transcribeDialogLink,
        controller: ['$scope', '$element', transcribeDialogController],
        replace: true,
        scope: true,
        templateUrl: 'overlay/transcribe-dialog.html'
    };
    return directive;

    // @ngInject
    function transcribeDialogController($scope, $element) {
        $scope.active = false;
        $scope.data = {};
        $scope.transcription = '';
        $scope.buttons = [
            { name: 'Insertion', tag: 'insertion' },
            { name: 'Deletion', tag: 'deletion' },
            { name: 'Illegible', tag: 'illegible' },
            { name: 'Not English', tag: 'notenglish' }
        ];

        var textarea = $element.find('textarea').first();

        var vm = this;
        vm.close = closeDialog;
        vm.open = openDialog;
        vm.saveAndClose = saveAndCloseDialog;
        vm.tag = tag;

        function closeDialog() {
            MarkingSurfaceFactory.enable();
            $scope.active = false;
            hotkeys.del('esc');
        }

        function getFocus() {
            textarea[0].focus();
        }

        function openDialog(data) {
            MarkingSurfaceFactory.disable();
            $scope.active = true;
            $scope.data = data.annotation;
            $scope.transcription = data.annotation.text;
            hotkeys.add({
                allowIn: ['TEXTAREA'],
                callback: closeDialog,
                combo: 'esc'
            });
            hotkeys.add({
                allowIn: ['TEXTAREA'],
                callback: function(event) {
                    event.preventDefault();
                    saveAndCloseDialog();
                },
                combo: 'enter'
            });
            $timeout(getFocus);
        }

        function saveAndCloseDialog() {
            if ($scope.transcription !== $scope.data.text) {
                $scope.data.text = $scope.transcription;
                AnnotationsFactory.upsert($scope.data);
            }
            closeDialog();
        }

        function tag(tagText) {
            var startTag = '[' + tagText + ']';
            var endTag = '[/' + tagText + ']';

            var start = textarea.prop('selectionStart');
            var end = textarea.prop('selectionEnd');
            var text = textarea.val();
            var textBefore = text.substring(0, start);
            var textInBetween;
            var textAfter;

            if (start === end) {
                textAfter = text.substring(start, text.length);
                textarea.val(textBefore + startTag + endTag + textAfter);
            } else {
                textInBetween = text.substring(start, end);
                textAfter = text.substring(end, text.length);
                textarea.val(textBefore + startTag + textInBetween + endTag + textAfter);
            }
            getFocus();
        }
    }

    // @ngInject
    function transcribeDialogLink(scope, element, attrs, dialog) {

        // Setup
        scope.close = dialog.close;
        scope.saveAndClose = dialog.saveAndClose;
        scope.tag = dialog.tag;
        new Draggabilly(element[0], {
            containment: '.overlay',
            handle: '.heading'
        });

        // Events
        scope.$on('transcribeDialog:open', openDialog);
        scope.$on('annotation:delete', closeDialogAfterDelete);

        // Methods
        function closeDialogAfterDelete(event, deleted) {
            if (scope.data && scope.data.$$hashKey && deleted.$$hashKey === scope.data.$$hashKey) {
                dialog.close();
            }
        }

        function openDialog(event, data) {
            dialog.open(data);
            positionDialog(event, data);
        }

        function positionDialog(event, data) {
            // Make sure that the dialog is positioned in a sensible place each
            // time it's opened. We always use the left and top values, as
            // that's what Dragabilly uses to determine position.
            var overlay = getDimensions(angular.element('.overlay').first());
            var group = getDimensions(data.element);
            var dialog = getDimensions(element);
            var constant = 10; // Used to give some space from the annotation

            var position = {
                left: (group.offset.left + (group.width / 2)) - (dialog.width / 2),
                top: group.offset.top - overlay.offset.top
            };

            var inTopHalf = (group.offset.top + group.height) < (overlay.height / 2) + overlay.offset.top;
            if (inTopHalf) {
                position.top = position.top + group.height + constant;
            } else {
                position.top = position.top - group.height - dialog.height - constant;
            }

            // Sanity check - is it off the screen?
            if (position.left < 0) {
                position.left = constant;
            } else if ((position.left + dialog.width) > overlay.width) {
                position.left = overlay.width - dialog.width - constant;
            }

            scope.position = position;
        }
    }
}

// Utility function to derive dimensions and offsets for dialog positioning,
// using getBoundingClientRect for SVG compatibility.
function getDimensions(element) {
    element = (element.jquery) ? element : angular.element(element);
    return {
        offset: element.offset(),
        height: element[0].getBoundingClientRect().height,
        width: element[0].getBoundingClientRect().width
    };
}
