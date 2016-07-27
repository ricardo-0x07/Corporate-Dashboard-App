/* global angular */
'use strict';
var Papa = require('papaparse');

angular
.module('core.papaParse')
.factory('PapaParse', [function() {
    var papaPromise = {};
    papaPromise.parse = function(file) {
        return new Promise(function(resolve, reject) {
            Papa.parse(file, Papa.parse(file, {
                header: true,
                download: true,
                complete: resolve,
                error: reject
            }));
        });
    };
    papaPromise.parseWOH = function(file) {
        return new Promise(function(resolve, reject) {
            Papa.parse(file, Papa.parse(file, {
                header: false,
                download: true,
                complete: resolve,
                error: reject
            }));
        });
    };
    return papaPromise;
}]);
