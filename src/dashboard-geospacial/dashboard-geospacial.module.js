'use strict';

var angular = require('angular');
var $ = require('jquery');
// require('./home.component');
module.exports = angular.module('dashboardGeospacial', [
    // 'core.api'  // ,
    // 'uiGmapgoogle-maps'
])
.component('dashboardGeospacial', {
    templateUrl: '/dashboard-geospacial/dashboard-geospacial.template.html',
    controller: ['$window', '$state', function DashboardGeospacialController($window, $state) {
        var $ctrl = this;
        // $('body').css('height', '100% !important');
        console.log('test');
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
