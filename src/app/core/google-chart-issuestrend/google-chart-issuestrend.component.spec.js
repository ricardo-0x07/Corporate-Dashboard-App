/* global angular */
/* eslint-env jasmine */
'use strict';
describe('googleChartIssuestrend', function() {
    // Load the module that contains the `googleChartIssuestrend` component before each test
    beforeEach(angular.mock.module('core.googleChartIssuestrend'));
    // Test the controller
    describe('GoogleChartIssuesTrendController', function() {
        var $componentController;
        var ctrl;
        var sortedData;
        var formatedData;
        var data = [{customers: '53', date: '7/10/2015', id: '49', openIssues: '13', reportedIssues: '42'},
                {customers: '53', date: '7/15/2015', id: '49', openIssues: '13', reportedIssues: '42'}];
        beforeEach(function() {
            jasmine.addCustomEqualityTester(angular.equals);
            angular.mock.inject(function(_$componentController_) {
                $componentController = _$componentController_;
                ctrl = $componentController('googleChartIssuestrend');
                sortedData = ctrl.sortData(data);
                formatedData = ctrl.formatData(sortedData);
                // ctrl.setChartData(formatedData);
                ctrl.init();
                console.log('ctrl.chart', ctrl.chart);
            });
        });
        it('should create a chart of type BarChart', function() {
            expect(ctrl.chart.type).toBe('BarChart');
        });
        xit('the chart data object is defined', function() {
            expect(ctrl.chart.data).toBeDefined();
        });
        it('the sortData function should sort data by date,', function() {
            // sortedData = ctrl.sortData(data);
            expect(new Date(sortedData[1].date).getTime()).toBeGreaterThan(new Date(sortedData[0].date).getTime());
        });
        it('the formatData function should extract the number of customers and date from each entry,', function() {
            formatedData = ctrl.formatData(sortedData);
            expect(formatedData[0].length).toBe(2);
            expect(formatedData[0][0]).toEqual(jasmine.any(String));
            expect(formatedData[0][1]).toEqual(jasmine.any(Number));
        });
        xit('the setChartData function should set 100 rows of data to the chart,', function() {
            // sortedData = sortData(data);
            // expect(new Date(sortedData[1].date).getTime()).toBeGreaterThan(new Date(sortedData[0].date).getTime());
        });
    });
});
