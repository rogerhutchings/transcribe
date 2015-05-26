'use strict';

var angular = require('angular');
var bulk = require('bulk-require');

// Angular modules
var appConfig = require('./app.config.js');
require('angular-bootstrap');
require('angular-local-storage');
require('angular-ui-router');
require('angular-hotkeys');
require('angular-animate');

// App modules
bulk(__dirname, ['./**/!(app.module).js']);

// Create and bootstrap application
angular.element(document).ready(startApp);

function startApp() {

    var requires = [
        // Angular modules
        'ui.router',
        'ui.bootstrap',
        'LocalStorageModule',
        'cfp.hotkeys',
        'ngAnimate',

        // App modules
        'app.core',
        'app.404',
        'app.layout',
        'app.static',
        'app.transcribe'
    ];

    // Mount on window for testing
    window.app = angular
        .module('app', requires)
        .constant('appConfig', appConfig.constants)
        .config(appConfig.routes)
        .config(appConfig.localStorage);

    angular.bootstrap(document, ['app'], {
        strictDi: true
    });

}
