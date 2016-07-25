/* global angular */
'use strict';

angular.module('dashboardDataview')
.component('dashboardDataview', {
    templateUrl: '/dashboard-dataview/dashboard-dataview.template.html',
    controller: ['$window', 'APIService', '$interval', function DashboardDataviewController($window, APIService, $interval) {
        var $ctrl = this;
        $ctrl.issues = [];
        $ctrl.currentPage = 1;
        $ctrl.pageSize = 5;

        $ctrl.paginateIssues = function() {
            console.log('paginateIssues');
            $ctrl.begin = (($ctrl.currentPage - 1) * $ctrl.pageSize);
            $ctrl.end = $ctrl.begin + $ctrl.pageSize;
            $ctrl.pagedIssues = $ctrl.issues.slice($ctrl.begin, $ctrl.end);
            return Promise.resolve($ctrl.pagedIssues);
        };

        var processResponse = function(response) {
            console.log('response.data', response.data);
            $ctrl.issues = response.data;
            $ctrl.totalItems = response.data.length;
        };
        $ctrl.fetchAllIssues = function() {
            return APIService.get('./data/issues.json')
            .then(processResponse)
            .then($ctrl.pageChanged);
        };
        $ctrl.pageChanged = function() {
            console.log('Page changed to: ' + $ctrl.currentPage);
            $ctrl.paginateIssues();
        };
        $ctrl.$onInit = function() {
            $ctrl.fetchAllIssues();
        };
        $ctrl.setPage = function(pageNo) {
            $ctrl.currentPage = pageNo;
        };
        $ctrl.propertyName = 'submission';
        $ctrl.reverse = true;

        $ctrl.sortBy = function(propertyName) {
            console.log('sortby');
            $ctrl.reverse = ($ctrl.propertyName === propertyName) ? !$ctrl.reverse : false;
            $ctrl.propertyName = propertyName;
        };
        $ctrl.startLongPolling = $interval(function() {
            $ctrl.fetchAllIssues();
        }, 5000);
        $ctrl.endLongPolling = function() {
            console.log('endLongPolling');
            if (angular.isDefined($ctrl.startLongPolling)) {
                console.log('angular.isDefined($ctrl.startLongPolling)');
                $interval.cancel($ctrl.startLongPolling);
                $ctrl.startLongPolling = undefined;
            }
        };
        $ctrl.$onDestroy = function() {
            $ctrl.endLongPolling();
        };
    }]
});
