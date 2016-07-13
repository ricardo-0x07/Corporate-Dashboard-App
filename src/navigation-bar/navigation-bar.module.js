'use strict';

var angular = require('angular');
// var globals = require('../js/globals');

module.exports = angular.module('navigationBar', [])
.component('navigationBar', {
    templateUrl: '/navigation-bar/navigation-bar.template.html',
    controller: ['$window', '$state', function NavigationBarController($window, $state) {
        var $ctrl = this;
        // $ctrl.auth = AuthService;
        // $ctrl.username = $window.sessionStorage.getItem(globals.auth.USER_NAME);
        // console.log('$ctrl.username', $ctrl.username);
        // $ctrl.signOut = function() {
        //     AuthService.signout();
        //     // redirect after logout
        //     $state.go('landing.login');
        // };
    }]
});
