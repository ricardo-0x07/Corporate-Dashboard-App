'use strict';

var angular = require('angular');
// require('./home.component');
var Papa = require('papaparse');
module.exports = angular.module('dashboardKeymetrics', [
    // 'core.api'  // ,
    // 'uiGmapgoogle-maps'
])
.component('dashboardKeymetrics', {
    templateUrl: '/dashboard-keymetrics/dashboard-keymetrics.template.html',
    controller: ['$window', '$state', function DashboardKeymetricsController($window, $state) {
        var $ctrl = this;
        // $ctrl.auth = AuthService;
        // $ctrl.map = {center: {latitude: 45, longitude: -73}, zoom: 8};      
        // $ctrl.signUp = function() {
        //     console.log('signUp button clicked');
        // };
        // $ctrl.signIn = function() {
        //     console.log('signIn button clicked');
        // };
    }]
});
