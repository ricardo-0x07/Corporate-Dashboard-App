/* global angular */
'use strict';

require('angular-google-chart');

angular.module('core.googleChartIssuestrend')
.component('googleChartIssuestrend', {
    templateUrl: '/core/google-chart-issuestrend/google-chart-issuestrend.template.html',
    controller: ['$window', 'googleChartApiPromise', 'PapaParse', '$interval', function GoogleChartIssuesTrendController($window, googleChartApiPromise, PapaParse, $interval) {
        var $ctrl = this;
        $ctrl.chart = {};
        $ctrl.chart.type = 'BarChart';

        $ctrl.sortData = function(data) {
            function comp(a, b) {
                return new Date(a[0]).getTime() - new Date(b[0]).getTime();
            }
            var newData = [];
            newData.push(data[0]);
            var dataToSort = data.slice(1);
            var results = newData.concat(dataToSort.sort(comp));
            return results;
        };

        $ctrl.formatData = function(data) {
            var newData = [];
            newData.push(data[0].slice(3).reverse());
            for (var i = 1; i < data.length; i++) {
                data[i].splice(3, 1, parseInt(data[i][1]));
                newData.push(data[i].slice(3).reverse());
            }
            return newData;
        };

        $ctrl.setChartData = function(data) {
            $ctrl.chart.data = data;
            $ctrl.chart.options = {
                title: 'Reported Issues',
                vAxis: {
                    title: "Date"
                },
                hAxis: {
                    title: "Number of Issues"
                }

            };
        };

        $ctrl.processResponse = function(response) {
            var data = $ctrl.sortData(response.data);
            return data.slice(0, 20);
        };

        $ctrl.fetchTrendOfReportedIssues = function() {
            return PapaParse.parseWOH('../../data/trends.csv');
        };
        $ctrl.init = function() {
            $ctrl.fetchTrendOfReportedIssues()
            .then($ctrl.processResponse)
            .then($ctrl.formatData)
            .then($ctrl.sortData)
            .then($ctrl.setChartData);
        };
        $ctrl.$onInit = function() {
            $ctrl.init();
        };

        $ctrl.startLongPolling = $interval(function() {
            $ctrl.init();
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
    }],
    bindings: {
        fieldValue: '<',
        fieldType: '@?',
        label: '@',
        class: '@',
        placeholder: '@',
        errorMessage: '@',
        onUpdate: '&'
    }
});
