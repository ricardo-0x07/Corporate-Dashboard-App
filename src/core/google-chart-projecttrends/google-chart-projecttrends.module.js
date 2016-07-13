'use strict';

var angular = require('angular');
require('angular-google-chart');
var Papa = require('papaparse');
var _ = require('lodash');
var $ = require('jquery');

module.exports = angular.module('core.googleChartProjecttrends', ['googlechart'])
.component('googleChartProjecttrends', {
    templateUrl: '/core/google-chart-projecttrends/google-chart-projecttrends.template.html',
    controller: ['$window', '$state', 'googleChartApiPromise', function GoogleChartProjectTrendsController($window, $state, googleChartApiPromise) {
        var $ctrl = this;
        $ctrl.chart = {};
        console.log('google-chart-projecttrends.module.js');

        function init() {
            googleChartApiPromise.then(function() {
                $ctrl.chart.type = 'LineChart';
                $ctrl.chart.data = new $window.google.visualization.DataTable();

                var processResponse = function(response) {
                    console.log('response', response);
                    var data = response.data.slice(0, 60);
                    console.log('data', data);
                    function comp(a, b) {
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    }

                    data.sort(comp);

                    // var reformattedArray = response.data.slice(0, 80).map(function(obj) { 
                    var reformattedArray = data.map(function(obj) { 
                        var newSubArray = [];
                        newSubArray.push(obj.date);
                        newSubArray.push(parseInt(obj.customers));
                        console.log('newSubArray', newSubArray);
                        return newSubArray;
                    });
                    $ctrl.chart.data.addColumn('string', 'Date');
                    $ctrl.chart.data.addColumn('number', 'Number of Paying Customers');
                    $ctrl.chart.data.addRows(reformattedArray);
                    $ctrl.chart.options = {
                        title: 'Number of Paying Customers' // ,
                        // width:400,
                        // height:300
                    };
                };

                $ctrl.fetchTrendOfReportedIssues = function() {
                    Papa.parse("../../data/trends.csv", {
                        header: true,
                        download: true,
                        complete: processResponse
                    });
                };
                $ctrl.fetchTrendOfReportedIssues();
                // APIService.get('/trends')
                // .then(function(response) {
                //     console.log('response', response);
                //     var reformattedArray = response.data.map(function(obj) { 
                //         var newSubArray = [];
                //         newSubArray.push(obj.created_date);
                //         newSubArray.push(obj.total_projects);
                //         console.log('newSubArray', newSubArray);
                //         return newSubArray;
                //     });
                //     $ctrl.chart.data.addColumn('string', 'Date');
                //     $ctrl.chart.data.addColumn('number', 'Issues');
                //     $ctrl.chart.data.addRows(reformattedArray);
                //     $ctrl.chart.options = {
                //         title: 'Reported Issues' // ,
                //         // width:400,
                //         // height:300
                //     };

                // });
            });
        }
        init();
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
