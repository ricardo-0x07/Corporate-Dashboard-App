/* global angular */
'use strict';
var _ = require('lodash');
angular.module('dashboardKeymetrics')
.component('dashboardKeymetrics', {
    templateUrl: '/dashboard-keymetrics/dashboard-keymetrics.template.html',
    controller: ['$window', '$state', 'PapaParse', '$interval', 'APIService', function DashboardKeymetricsController($window, $state, PapaParse, $interval, APIService) {
        var $ctrl = this;
        $ctrl.openIssues = 0;
        $ctrl.issues = [];
        var processResponse = function(response) {
            $ctrl.issues = response.data;
            var open = _.filter($ctrl.issues, ['status', 'open']);
            $ctrl.openIssues = open.length;
        };
        $ctrl.fetchAllIssues = function() {
            return APIService.get('./data/issues.json')
            .then(processResponse);
        };
        $ctrl.$onInit = function() {
            $ctrl.fetchAllIssues();
        };
        $ctrl.startLongPolling = $interval(function() {
            $ctrl.fetchAllIssues();
        }, 5000);
        $ctrl.endLongPolling = function() {
            if (angular.isDefined($ctrl.startLongPolling)) {
                $interval.cancel($ctrl.startLongPolling);
                $ctrl.startLongPolling = undefined;
            }
        };
        $ctrl.$onDestroy = function() {
            $ctrl.endLongPolling();
        };
    }]
});
