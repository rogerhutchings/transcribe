(function (angular) {

    'use strict';

    var app = angular.module('app');

    app.directive('imageAnnotation', [
        'AnnotationsFactory',
        'Config',
        function (Annotations, Config) {
            return {
                scope: {
                    data: '='
                },
                restrict: 'A',
                replace: true,
                templateUrl: 'directives/image-annotation.html',
                link: function (scope, element, attrs) {

                    var ClassifyCtrl = scope.$parent.$parent;
                    var panZoom = ClassifyCtrl.panZoom;
                    var viewport = angular.element(ClassifyCtrl.viewport);

                    scope.r = Config.svg.pointSize;

                    scope.addHoverClass = function () {
                        element.addClass('hover');
                    };

                    scope.removeHoverClass = function () {
                        element.removeClass('hover');
                    };

                    scope.activateEdit = function ($event) {
                        $event.preventDefault();
                        $event.stopImmediatePropagation();
                        element.addClass('edit');
                        viewport.on('click', scope.deactivateEdit);
                    };

                    scope.deactivateEdit = function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation();

                        viewport.off('click');
                        element.removeClass('edit');
                    };

                    scope.click = function ($event) {
                        $event.preventDefault();
                        $event.stopImmediatePropagation();
                    };

                    scope.delete = function () {
                        console.log('delete')
                        Annotations.destroy(scope.data);
                    };

                    scope.deleteR = 10

                }
            }
        }
    ]);

}(window.angular));