/* global angular */
'use strict';

require('angular-google-chart');

angular.module('core.googleChartCustomertrends')
.component('googleChartCustomertrends', {
    templateUrl: '/core/google-chart-customertrends/google-chart-customertrends.template.html',
    controller: ['$window', 'googleChartApiPromise', 'PapaParse', '$interval', function GoogleChartCustomerTrendsController($window, googleChartApiPromise, PapaParse, $interval) {
        var $ctrl = this;
        $ctrl.chart = {};
        $ctrl.chart.type = 'LineChart';
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
            newData.push([data[0][4], data[0][1]]);
            for (var i = 1; i < data.length; i++) {
                data[i].splice(1, 1, parseInt(data[i][1]));
                newData.push([data[i][4], data[i][1]]);
            }
            return newData;
        };

        $ctrl.setChartData = function(data) {
            $ctrl.chart.data = data;
            $ctrl.chart.options = {
                title: 'Number of Paying Customers',
                vAxis: {
                    title: "Number of Paying Customers"
                },
                hAxis: {
                    title: "Dates"
                }

            };
        };

        $ctrl.processResponse = function(response) {
            var data = response.data.slice(0, 60);
            return data;
        };

        $ctrl.fetchTrendOfReportedIssues = function() {
            return PapaParse.parseWOH("../../data/trends.csv");
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
