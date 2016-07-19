/* global angular */
/* eslint-env jasmine */
'use strict';
var GoogleMapsLoader = require('google-maps');
var baseUrl = GoogleMapsLoader.URL;
var cb = GoogleMapsLoader.WINDOW_CALLBACK_NAME;

describe('googleMap', function() {
    // Load the module that contains the `googleMap` component before each test
    beforeEach(angular.mock.module('core.googleMap'));
    // Test the controller
    describe('GoogleMapController', function() {
        var $componentController;
        var ctrl;
        var module;
        var dependencies;
        dependencies = [];

        var hasModule = function(module) {
            return dependencies.indexOf(module) >= 0;
        };

        beforeEach(function() {
            GoogleMapsLoader.makeMock();
            jasmine.addCustomEqualityTester(angular.equals);
            angular.mock.inject(function(_$componentController_) {
                $componentController = _$componentController_;
                ctrl = $componentController('googleMap');
            });
        });
        afterEach(function(done) {
            GoogleMapsLoader.release(function() {
                done();
            });
        });
        it('should load papaParse module', function() {
            // Get module
            module = angular.module('core.googleMap');
            dependencies = module.requires;
            expect(hasModule('core.papaParse')).toBeTruthy();
        });
        describe('#load', function() {

            it('should load google api object', function(done) {
                GoogleMapsLoader.load(function(google) {
                    expect(google).toEqual(jasmine.any(Object));
                    expect(GoogleMapsLoader.isLoaded()).toBe.true;
                    done();
                });
            });
            it('should load google api only for first time and then use stored object', function(done) {
                var count = 0;

                GoogleMapsLoader.onLoad(function() {
                    count++;
                });

                GoogleMapsLoader.load();
                GoogleMapsLoader.load();
                GoogleMapsLoader.load();

                GoogleMapsLoader.load(function() {
                    expect(count).toBe(1);
                    done()
                });
            });
        });

        describe('#release', function() {

            it('should restore google maps package to original state and remove google api object completely and load it again', function(done) {
                GoogleMapsLoader.load(function() {
                    expect(GoogleMapsLoader.isLoaded()).toBe.true;

                    GoogleMapsLoader.release(function() {
                        expect(GoogleMapsLoader.isLoaded()).toBe.false;

                        GoogleMapsLoader.makeMock();
                        GoogleMapsLoader.load(function() {
                            expect(GoogleMapsLoader.isLoaded()).toBe.true;
                            done();
                        });
                    });
                });
            });
        });
        xdescribe('#createUrl', function() {

            it('should create url with key', function() {
                GoogleMapsLoader.KEY = 'abcdefghijkl';
                expect(GoogleMapsLoader.createUrl()).to.be.equal(baseUrl + '?callback=' + cb + '&key=abcdefghijkl');
            });

            it('should create url with one library', function() {
                GoogleMapsLoader.LIBRARIES = ['hello'];
                expect(GoogleMapsLoader.createUrl()).to.be.equal(baseUrl + '?callback=' + cb + '&libraries=hello');
            });

            it('should create url with more libraries', function() {
                GoogleMapsLoader.LIBRARIES = ['hello', 'day'];
                expect(GoogleMapsLoader.createUrl()).to.be.equal(baseUrl + '?callback=' + cb + '&libraries=hello,day');
            });

            it('should create url with client and version', function() {
                GoogleMapsLoader.CLIENT = 'buf';
                GoogleMapsLoader.VERSION = '999';
                expect(GoogleMapsLoader.createUrl()).to.be.equal(baseUrl + '?callback=' + cb + '&client=buf&v=999');
            });

            it('should create url with channel', function() {
                GoogleMapsLoader.CHANNEL = 'abcdefghijkl';
                expect(GoogleMapsLoader.createUrl()).to.be.equal(baseUrl + '?callback=' + cb + '&channel=abcdefghijkl');
            });

            it('should create url with language', function() {
                GoogleMapsLoader.LANGUAGE = 'fr';
                expect(GoogleMapsLoader.createUrl()).to.be.equal(baseUrl + '?callback=' + cb + '&language=fr');
            });

            it('should create url with region', function() {
                GoogleMapsLoader.REGION = 'GB';
                expect(GoogleMapsLoader.createUrl()).to.be.equal(baseUrl + '?callback=' + cb + '&region=GB');
            });
        });
    });
});
