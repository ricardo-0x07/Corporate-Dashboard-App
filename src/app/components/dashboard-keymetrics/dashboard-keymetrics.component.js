/* global angular */
'use strict';
var _ = require('lodash');
angular.module('dashboardKeymetrics')
.component('dashboardKeymetrics', {
    templateUrl: '/dashboard-keymetrics/dashboard-keymetrics.template.html',
    controller: ['$window', '$state', 'PapaParse', function DashboardKeymetricsController($window, $state, PapaParse) {
        var $ctrl = this;
        $ctrl.openIssues = 0;
        $ctrl.issues = [];
        var processResponse = function(response) {
            console.log('response.data', response.data);
            $ctrl.issues = response.data;
            var open = _.filter($ctrl.issues, ['status', 'open']);
            console.log('open.length', open.length);
            $ctrl.openIssues = open.length;
        };
        $ctrl.fetchAllIssues = function() {
            return PapaParse.parse('./data/issues.csv')
            .then(processResponse);
        };
        $ctrl.$onInit = function() {
            $ctrl.fetchAllIssues();
        };
    }]
});
