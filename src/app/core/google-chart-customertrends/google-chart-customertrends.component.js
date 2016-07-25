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
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            }

            return data.sort(comp);
        };

        $ctrl.formatData = function(data) {
            var reformattedArray = data.map(function(obj) { 
                var newSubArray = [];
                newSubArray.push(obj.date);
                newSubArray.push(parseInt(obj.customers));
                console.log('newSubArray', newSubArray);
                return newSubArray;
            });
            return reformattedArray;
        };

        $ctrl.setChartData = function(reformattedArray) {
            $ctrl.chart.data = new $window.google.visualization.DataTable();
            $ctrl.chart.data.addColumn('string', 'Date');
            $ctrl.chart.data.addColumn('number', 'Number of Paying Customers');
            $ctrl.chart.data.addRows(reformattedArray);
            $ctrl.chart.options = {
                title: 'Number of Paying Customers'
            };
            console.log('$ctrl.chart.data', $ctrl.chart.data);
        };

        $ctrl.processResponse = function(response) {
            console.log('response', response);
            var data = response.data.slice(0, 60);
            console.log('data', data);
            return data;
        };

        $ctrl.fetchTrendOfReportedIssues = function() {
            return PapaParse.parse("../../data/trends.csv");
        };
        // $ctrl.fetchTrendOfReportedIssues()
        $ctrl.init = function() {
            googleChartApiPromise
            .then($ctrl.fetchTrendOfReportedIssues)
            .then($ctrl.processResponse)
            .then($ctrl.sortData)
            .then($ctrl.formatData)
            .then($ctrl.setChartData);
        };
        $ctrl.$onInit = function() {
            $ctrl.init();
        };

        $ctrl.startLongPolling = $interval(function() {
            $ctrl.init();
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
