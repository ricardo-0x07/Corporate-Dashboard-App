'use strict';

var angular = require('angular');
require('angular-ui-bootstrap');
module.exports = angular.module('dashboard', [
    // 'core.api',
    'ui.bootstrap'
    // 'uiGmapgoogle-maps'
])
.component('dashboard', {
    templateUrl: '/dashboard/dashboard.template.html',
    controller: ['$window', '$state', function DashboardController($window, $state) {
        var $ctrl = this;
        $ctrl.state = $state;

        // $ctrl.auth = AuthService;
        // $ctrl.map = {center: {latitude: 45, longitude: -73}, zoom: 8};  
        // $state.go('dashboard.geospacial');    
        // $ctrl.signUp = function() {
        //     console.log('signUp button clicked');
        // };
        // $ctrl.signIn = function() {
        //     console.log('signIn button clicked');
        // };
    }]
});
