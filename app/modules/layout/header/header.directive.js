'use strict';

require('./header.module.js')
    .directive('appHeader', appHeader);

function appHeader() {
    var directive = {
        restrict: 'A',
        replace: true,
        templateUrl: 'header/header.html',
        controller: HeaderController,
        controllerAs: 'vm'
    };
    return directive;
}

// @ngInject
function HeaderController($scope, $state) {
    var vm = this;

    $scope.$watch(function () {
        return $state.current.params;
    }, function (params) {
        vm.hideHook = (params && params.hideHook) ? true : false;
        vm.overlap = (params && params.overlap) ? true : false;
    });

    vm.links = [
        {
            label: 'Transcribe',
            state: 'Transcribe'
        },
        {
            label: 'Artists',
            state: 'ArtistList'
        },
        {
            label: 'About',
            state: 'About'
        },
        {
            label: 'Guide',
            state: 'GuideBase'
        },
        {
            label: 'Team',
            state: 'Team'
        }
    ];
}
