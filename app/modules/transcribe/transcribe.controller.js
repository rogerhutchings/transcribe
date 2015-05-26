'use strict';

require('./transcribe.module.js')
    .controller('TranscribeCtrl', TranscribeCtrl);

// @ngInject
function TranscribeCtrl($rootScope, $scope, Annotations) {

    // ViewModel
    var vm = this;
    vm.annotations = Annotations.list();

    $scope.$on('next', loadNextSubject);

    vm.centre = function () {
        $rootScope.$broadcast('panZoom:centre');
    }

    function loadNextSubject() {
        Annotations.reset();
        // TODO: reset tools
    }

}
