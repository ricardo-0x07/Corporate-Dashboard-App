/* global angular */
'use strict';

require('angular-google-chart');

angular.module('core.googleChartIssuestrend')
.component('googleChartIssuestrend', {
    templateUrl: '/core/google-chart-issuestrend/google-chart-issuestrend.template.html',
    controller: ['$window', 'googleChartApiPromise', 'PapaParse', function GoogleChartIssuesTrendController($window, googleChartApiPromise, PapaParse) {
        var $ctrl = this;
        $ctrl.chart = {};
        $ctrl.chart.type = 'BarChart';
        console.log('google-chart-projecttrends.module.js');

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
                newSubArray.push(parseInt(obj.reported_issues));
                console.log('newSubArray', newSubArray);
                return newSubArray;
            });
            return reformattedArray;
        };

        $ctrl.setChartData = function(reformattedArray) {
            $ctrl.chart.data = new $window.google.visualization.DataTable();
            $ctrl.chart.data.addColumn('string', 'Date');
            $ctrl.chart.data.addColumn('number', 'Reported Issues');
            $ctrl.chart.data.addRows(reformattedArray);
            $ctrl.chart.options = {
                title: 'Reported Issues'
            };
        };

        $ctrl.processResponse = function(response) {
            console.log('response', response);
            var data = response.data.slice(0, 60);
            console.log('data', data);
            return data;
        };

        $ctrl.fetchTrendOfReportedIssues = function() {
            return PapaParse.parse('../../data/trends.csv');
        };

        $ctrl.init = function() {
            googleChartApiPromise
            .then($ctrl.fetchTrendOfReportedIssues)
            .then($ctrl.processResponse)
            .then($ctrl.sortData)
            .then($ctrl.formatData)
            .then($ctrl.setChartData);
        };
        $ctrl.init();
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
