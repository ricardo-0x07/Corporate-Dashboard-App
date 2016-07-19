/* global angular */
/* eslint-env jasmine */
'use strict';
describe('papaparse service', function() {
    var PapaParse;

    // Load the module that contains the `Phone` service before each test
    beforeEach(angular.mock.module('core.papaParse'));

    // instantiate service
    PapaParse = {};

    // Instantiate the service and "train" `$httpBackend` before each test
    beforeEach(angular.mock.inject(function(_PapaParse_) {
        PapaParse = _PapaParse_;
    }));
    it('should parse a csv string', function() {
        var csvString = 'dist/data/locations.csv';
        console.log(csvString);
        console.log(PapaParse);

        PapaParse.parse(csvString)
        .then(function(results) {
            console.log('results');
            // Propagate promise resolution to 'then' functions using $apply().
            expect(results.length).toBe(2);
        })
        .catch(function(err) {
            console.log(err);
        });
    });
});
