/* global angular */
'use strict';

require('angular-ui-bootstrap');
angular.module('dashboard', [
    'ui.bootstrap'
])
.component('dashboard', {
    templateUrl: '/dashboard/dashboard.template.html',
    controller: ['$window', '$state', function DashboardController($window, $state) {
        var $ctrl = this;
        $ctrl.state = $state;
        $state.go('dashboard.geospacial');
    }]
});
