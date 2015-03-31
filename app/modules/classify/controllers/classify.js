(function (angular, _) {

    'use strict';

    var module = angular.module('transcribe.classify');

    module.controller('ClassifyCtrl', [
        '$scope',
        '$modal',
        'AnnotationsFactory',
        // 'DummySubjectsFactory',
        'SubjectsFactory',
        function ($scope, $modal, Annotations, Subjects) {

            $scope.subject = { isLoaded: false };
            $scope.activeTool = null;
            $scope.editingTextAnnotation = null;

            $scope.setTool = function (tool) {
                if ($scope.activeTool) {
                    $scope.activeTool.deactivate();
                }
                if (!$scope.activeTool || ($scope.activeTool && $scope.activeTool.name !== tool.name )) {
                    $scope.activeTool = tool;
                    $scope.activeTool.activate();
                } else {
                    $scope.activeTool = null;
                }
            };

            var getNextSubject = function () {
                $scope.subject.isLoaded = false;
                console.log('Getting subject');
                Subjects.get()
                    .then(function (response) {
                        $scope.subject.data = response;
                        $scope.subject.isLoaded = true;
                        $scope.annotations = Annotations.list();
                        console.log(response)
                    });
            };

            var submitThenGetNextSubject = function (transcriptionComplete) {
                $scope.subject.data.transcriptionComplete = transcriptionComplete;
                Annotations.submit($scope.subject.data).then(function (response) {
                    console.log('complete', response);
                });
                Annotations.reset();
                // Why you no, two-way binding?
                $scope.annotations = Annotations.list();
                getNextSubject();
            };

            $scope.next = function () {

                var modalInstance = $modal.open({
                    templateUrl: 'classify/templates/modal-next.html',
                    controller: 'ClassifyModalNextCtrl',
                    size: 'sm',
                    backdrop: 'static'
                });

                modalInstance.result.then(submitThenGetNextSubject);

            };

            // Go!
            getNextSubject();

        }

    ]);

}(window.angular, window._));
