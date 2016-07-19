/* global angular */
'use strict';

angular.module('dashboardDataview')
.component('dashboardDataview', {
    templateUrl: '/dashboard-dataview/dashboard-dataview.template.html',
    controller: ['$window', 'PapaParse', function DashboardDataviewController($window, PapaParse) {
        var $ctrl = this;
        $ctrl.issues = [];
        // $ctrl.pagedIssues;
        $ctrl.currentPage = 1;
        $ctrl.pageSize = 5;
        // $ctrl.totalItems = 0;

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
            // $ctrl.currentPage = 1;
            return PapaParse.parse('./data/issues.csv')
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
            $ctrl.reverse = ($ctrl.propertyName === propertyName) ? !$ctrl.reverse : false;
            $ctrl.propertyName = propertyName;
        };
    }]
});
