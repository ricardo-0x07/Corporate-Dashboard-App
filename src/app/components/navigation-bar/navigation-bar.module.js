/* global angular */
'use strict';

angular.module('navigationBar', [])
.component('navigationBar', {
    templateUrl: '/navigation-bar/navigation-bar.template.html',
    controller: ['$window', '$state', function NavigationBarController($window, $state) {
        var $ctrl = this;
    }]
});
