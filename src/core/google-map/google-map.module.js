'use strict';

var angular = require('angular');
var GoogleMapsLoader = require('google-maps');
var ArbitratorConfig = require('../../js/config');
var $ = require('jquery');
var globals = require('../../js/globals');
var Papa = require('papaparse');

module.exports = angular.module('core.googleMap', [])
.component('googleMap', {
    templateUrl: '/core/google-map/google-map.template.html',
    controller: ['$window', '$state', function SignUpController($window, $state) {
        var $ctrl = this;
        $ctrl.projectIndex = 0;
        // current selected marker
        $ctrl.currentMarker = null;
        // array of markers generated
        $ctrl.markers = [];
        // options for google maps
        $ctrl.mapOptions = {disableDefaultUI: true};
        // var that stores google service
        $ctrl.service = null;
        $ctrl.google = null;
        // Information window that displays place details
        $ctrl.infoWindow = null;
        // Information window that displays yelp data retrieval error
        $ctrl.errorInfoWindow = null;
        // Information window that displays a loading animation
        $ctrl.loadingInfoWindow = null;
        // Google request time out boolean var
        $ctrl.timedOut = false;
        // Google map object
        $ctrl.map = null;
        // Google request time out timer
        $ctrl.requestTimer = null;
        $ctrl.stop = false;
        $ctrl.isInfoWindowLoaded = false;
        // $ctrl.isYelpError: false,
        $ctrl.isErrorInfoWindowLoaded = false;
          /**
          * @description get an instance of the information window for each marker that displays request details
          * @constructor
          */
        $ctrl.getInfoWindow = function() {
            var templateBinding =
            '<div id="info-window">' +
              '<h4>' + $ctrl.currentProject.name + '</h4>' +
              '<h6><strong>The 3 other nearby places via Yelp</strong></h6>' +
              '<table class="table table-striped table-condensed" id="marker-tbl">' +
                '<thead><tr><th> Business </th><th> Rated </th>' +
                '<th class="hidden-xs"> Phone </th></tr> </thead>' +
                '<tbody data-bind="template: { name: \'business-template\', ' +
                'foreach: app.ViewModel.businesses, as: \'business\' }"></tbody>' +
                '</table>' +
            '</div>';
            $ctrl.isInfoWindowLoaded = false;
            return new $ctrl.google.maps.InfoWindow({
                content: templateBinding
            });
        };
        /**
        * @description get an instance of the information window for each marker that displays request errors
        * @constructor
        */
        $ctrl.getErrorInfoWindow = function() {
          var templateBinding = '<div id="error-info-window" data-bind="template:' +
          '{ name: \'yelp-error-template\', data: app.ViewModel.yelpErrorMessage }">';
          $ctrl.isErrorInfoWindowLoaded = false;
          return new $ctrl.google.maps.InfoWindow({
            content: templateBinding
          });
        };
        /**
        * @description get an instance of the information window for each marker that displays request loading animation
        * @constructor
        */
        $ctrl.getLoadingInfoWindow = function() {
            var templateBinding =
            '<i class="fa fa-refresh fa-spin" style="font-size:20px"></i>';
            return new $ctrl.google.maps.InfoWindow({
                content: templateBinding
            });
        };
        $ctrl.bounds = null;
        $ctrl.centerMap = function() {
            $ctrl.map.setCenter($ctrl.bounds.getCenter());
        };
          /** @description fallback function
          * @return {boolean} true when done
          */
        $ctrl.googleError = function() {
            // app.ViewModel.view('error-template');
            $ctrl.stop = true;
            return (true);
        };
        /*
        * @description init() starts the application
        */     
        $ctrl.initAutocomplete = function() {
            // The geocode type restricts the search to geographical location types.
            GoogleMapsLoader.KEY = ArbitratorConfig.apiKey;
            GoogleMapsLoader.LIBRARIES = ['places'];
            GoogleMapsLoader.SENSOR = false;

            GoogleMapsLoader.load(function(google) {
                $ctrl.google = google;
                // Create the autocomplete object, restricting the search to geographical
                // location types.

                $ctrl.map = new $ctrl.google.maps.Map($window.document.getElementById('map'), {disableDefaultUI: true});
                $ctrl.service = new $ctrl.google.maps.places.PlacesService($ctrl.map);
                // set a single instance of infoWindow to be reused for each marker
                // $ctrl.infoWindow = $ctrl.getInfoWindow();
                $ctrl.errorInfoWindow = $ctrl.getErrorInfoWindow();
                $ctrl.loadingInfoWindow = $ctrl.getLoadingInfoWindow();
                $window.mapBounds = new $ctrl.google.maps.LatLngBounds();
                // Iterates through the array of locations, creates a search object for each location
                var userId = $window.sessionStorage.getItem(globals.auth.USER_KEY);
                console.log('userId', userId);

                var process = function(response) {
                    console.log('response.data', response.data);
                    $ctrl.projects = response.data;
                    console.log('$ctrl.projects', $ctrl.projects);
                    var limit = 0;
                    $ctrl.projects.forEach(function(project) {
                        limit++;
                        // console.log('project.address', project.address);
                        // the search request object
                        $ctrl.currentProject = project;
                        var request = {query: project.address};
                        // Actually searches the Google Maps API for location data and runs the callback
                        // function with the search results after each search.
                        $ctrl.service.textSearch(request, function(results, status) {
                            $ctrl.textSearchCallback(results, status, project);
                        });
                        if (limit > 5) {
                            return;
                        }
                    });
                };

                Papa.parse("../../data/locations.csv", {
                    header: true,
                    download: true,
                    complete: process
                });

                // $ctrl.locations.forEach(function(place) {
                //     console.log('place', place);
                //     // the search request object
                //     var request = {query: place};
                //     // Actually searches the Google Maps API for location data and runs the callback
                //     // function with the search results after each search.
                //     $ctrl.service.textSearch(request, $ctrl.textSearchCallback);
                // });
                $ctrl.google.maps.event.addListener($ctrl.map, 'click', $ctrl.closeInfoWindow);

                // Sets the boundaries of the map based on pin locations
                // Sets the boundaries of the map based on pin locations
                $window.addEventListener('resize', function(e) {
                    // Make sure the map bounds get updated on page resize
                    $ctrl.map.fitBounds($window.mapBounds);
                });
            });
            // $ctrl.projects = null;
        };
        /*
        * @description Closes information windows
        */
        $ctrl.closeInfoWindow = function() {
            $ctrl.currentMarker.infoWindow.close();
            $ctrl.currentMarker.setAnimation(null);

            // $ctrl.errorInfoWindow.close();
            // $ctrl.loadingInfoWindow.close();
        };
        /*
        * @description callback(results, status) makes sure the search returned results for a location.
        If so, it creates a new map marker for that location.
        * @param {object} results - search returned results for a location
        * @param {string} status - places api request status
        */
        $ctrl.textSearchCallback = function(results, status, project) {
            console.log('project', project);
            console.log('status', status);
            if (status === $ctrl.google.maps.places.PlacesServiceStatus.OK) {
                console.log(results[0]);
                $ctrl.createMapMarker(results[0], project);
            } else {
                /* eslint-disable no-alert*/
                // app.model.googleError();
                $window.alert('Error retrieving list of places, Try Again');
                return;
            }
        };
        /*
        @description createMapMarker(placeData) reads Google Places search results to create map pins.
        placeData is the object returned from search results containing information
        about a single location.
        @param {object} placeData - Google Places search result data
        */
        $ctrl.createMapMarker = function(placeData, project) {
            console.log('createMapMarker');
            // The next lines save location data from the search result object to local variables
            var lat = placeData.geometry.location.lat();  // latitude from the place service
            var lon = placeData.geometry.location.lng();  // longitude from the place service
            var name = placeData.name;   // name of the place from the place service
            $ctrl.bounds = $window.mapBounds;            // current boundaries of the map window

            // marker is an object with additional data about the pin for a single location
            var marker = new $ctrl.google.maps.Marker({
                map: $ctrl.map,
                position: placeData.geometry.location,
                title: name,
                placeId: placeData.place_id,
                draggable: true,
                animation: $ctrl.google.maps.Animation.DROP,
                formatted_address: placeData.formatted_address
                // icon: placeData.icon
            });
            marker['infoWindow'] = new $ctrl.google.maps.InfoWindow({
                content: '<div>' +
                  '<div class="panel panel-default">' +
                    '<div class="panel-heading projectBg">' +
                      // '<h3 class="panel-title">Project: ' + project.name + '</h3>' +
                    '</div>' +
                    '<div class="panel-body">' +
                      '<p class="list-group-item" text="">Number of Employees:  ' + project.number_employees + '</p>' +
                      '<p class="list-group-item" text="">Location:  ' + project.address + '</p>' +
                    '</div>' +
                    // '<div class="panel-body">' +
                    //   '<a href="#/project/' + project.id + '">' +
                    //     '<paper-button >Update</paper-button>' +
                    //   '</a>' +
                    //   '<a ui-sref="#/jobs/' + project.id + '">' +
                    //     '<paper-button>Jobs</paper-button>' +
                    //   '</a>' +
                    //   '<a ui-sref="#/measurement/' + project.id + '">' +
                    //     '<paper-button>Measure</paper-button>' +
                    //   '</a>' +
                    //   // <paper-icon-button ng-model="collapsed" ng-click="collapsed=!collapsed" icon="hardware:keyboard-arrow-up" title="more info" id="icon_button" style="float:right;">
                    //   // </paper-icon-button>
                    //   // <div ng-show="collapsed" id="more-info-{{$ctrl.project.id}}" style="width:100%;">
                    //   //     <span ng-if="$ctrl.project.plannedStart" raised class="list-group-item">Start: {{$ctrl.project.plannedStart}}</span>
                    //   //     <span ng-if="$ctrl.project.duration" raised class="list-group-item">Duration: {{$ctrl.project.duration}}</span>
                    //   //     <span ng-if="$ctrl.project.value" raised class="list-group-item">Value: $ {{$ctrl.project.value}}</span>
                    //   //     <span ng-if="$ctrl.project.service.name" raised class="list-group-item">Service: {{$ctrl.project.service.name}}</span>
                    //   //     <span ng-if="$ctrl.project.project_status.description" raised class="list-group-item">Status: {{$ctrl.project.project_status.description}}</span>
                    //   //     <span ng-if="$ctrl.project.provider.name" raised class="list-group-item">Provider: {{$ctrl.project.provider.name}}</span>
                    //   //     <span ng-if="$ctrl.project.address" raised class="list-group-item">Location: {{$ctrl.project.address}}</span>
                    //   // </div>
                    // '</div>' +
                  '</div>' +
                '</div>'
                // content: '<p> ' + project.name + '</p>'
            });
            // add markers to marker array
            $ctrl.markers.push(marker);
            // app.ViewModel.markers.push(marker);

            
            // add listener to respond to click events on markers
            $ctrl.google.maps.event.addListener(marker, 'click', function() {
                $ctrl.map.panTo(marker.getPosition());
                if ($ctrl.currentMarker) {
                    $ctrl.closeInfoWindow();
                }
                marker.infoWindow.open($ctrl.map, marker);
                $ctrl.currentMarker = marker;
            });
            // add listener to trigger bounce animation for marker icon after they have been clicked
            marker.addListener('click', $ctrl.toggleBounce);
  
            // this is where the pin actually gets added to the map.
            // bounds.extend() takes in a map location object
            $ctrl.bounds.extend(new $ctrl.google.maps.LatLng(lat, lon));
            // fit the map to the new marker
            $ctrl.map.fitBounds($ctrl.bounds);
           // center the map
            $ctrl.centerMap();
        };
        $ctrl.toggleBounce = function() {
            $ctrl.markers.forEach(function(mark) {
                mark.setAnimation(null);
            });
            $ctrl.currentMarker.setAnimation($ctrl.google.maps.Animation.BOUNCE);
        };
        $ctrl.$onInit = function() {
            // Make a copy of the initial value to be able to reset it later
            $ctrl.fieldValueCopy = $ctrl.fieldValue;
            // Set a default fieldType
            if (!$ctrl.fieldType) {
                $ctrl.fieldType = 'text';
            }
            $ctrl.initAutocomplete();
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
