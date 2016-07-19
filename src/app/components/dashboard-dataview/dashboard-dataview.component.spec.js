/* global angular */
/* eslint-env jasmine */
'use strict';
describe('dashboardDataview', function() {
    // Load the module that contains the `dashboardDataview` component before each test
    beforeEach(angular.mock.module('dashboardDataview'));
    // Test the controller
    describe('DashboardDataviewController', function() {
        var $componentController;
        var ctrl;    
        beforeEach(function() {
            jasmine.addCustomEqualityTester(angular.equals);

            angular.mock.inject(function(_$componentController_) {
                $componentController = _$componentController_;
                ctrl = $componentController('dashboardDataview');
            });
        });
        it('should create aa empty `issues` array', function() {
            expect(ctrl.issues).toEqual([]);
        });
        it('the currentPage should be 1,', function() {
            expect(ctrl.currentPage).toBe(1);
        });
        it('the page size should be set to 5,', function() {
            expect(ctrl.pageSize).toBe(5);
        });
    });
});
