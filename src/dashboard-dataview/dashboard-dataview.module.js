'use strict';

var angular = require('angular');
var globals = require('../js/globals');
var Papa = require('papaparse');

module.exports = angular.module('dashboardDataview', [
    // 'core.api'  // ,
    // 'uiGmapgoogle-maps'
])
.component('dashboardDataview', {
    templateUrl: '/dashboard-dataview/dashboard-dataview.template.html',
    controller: ['$window', '$state', function DashboardDataviewController($window, $state) {
        var $ctrl = this;
        $ctrl.issues = [];
        console.log('dashboardDataview');

        $ctrl.paginateIssues = function() {
            var begin = (($ctrl.currentPage - 1) * $ctrl.pageSize);
            var end = begin + $ctrl.pageSize;
            $ctrl.pagedIssues = $ctrl.issues.slice(begin, end);
        };

        var processResponse = function(response) {
            $ctrl.currentPage = 1;
            $ctrl.pageSize = 5;
            $ctrl.issues = response.data;
            $ctrl.totalItems = response.data.length;
            $ctrl.paginateIssues();
        };

        $ctrl.fetchAllIssues = function() {
            Papa.parse("../../data/issues.csv", {
                header: true,
                download: true,
                complete: processResponse
            });
        };
        $ctrl.pageChanged = function() {
            $ctrl.paginateIssues();
        };
        $ctrl.fetchAllIssues();
        // $ctrl.pageChanged();
    }]
});
