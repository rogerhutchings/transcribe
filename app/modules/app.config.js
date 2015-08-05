'use strict';

var appInfo = require('../../package.json');

var appConfig = {
    appTitle: 'AnnoTate',
    appDescription: 'Help the Tate discover the lives of twentieth-century artists by transcribing their letters, diaries and sketchbooks.'
};

// @ngInject
function localStorage(localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix(appConfig.appTitle + '-' + appInfo.version);
}

module.exports = {
    constants: appConfig,
    localStorage: localStorage
};
