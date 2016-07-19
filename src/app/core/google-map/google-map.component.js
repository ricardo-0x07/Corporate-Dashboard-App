/* global angular, google */
'use strict';

var GoogleMapsLoader = require('google-maps');
var ArbitratorConfig = require('../../../assets/js/config');
var $ = require('jquery');

angular.module('core.googleMap')
.component('googleMap', {
    templateUrl: '/core/google-map/google-map.template.html',
    controller: ['$window', 'PapaParse', function GoogleMapController($window, PapaParse) {
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
        $ctrl.isErrorInfoWindowLoaded = false;
        $ctrl.googleLoad = function(google) {
            // Create the autocomplete object, restricting the search to geographical
            // location types.
            $ctrl.map = new google.maps.Map($window.document.getElementById('map'), $ctrl.mapOptions);
            $ctrl.service = new google.maps.places.PlacesService($ctrl.map);
            // set a single instance of infoWindow to be reused for each marker
            $ctrl.errorInfoWindow = $ctrl.getErrorInfoWindow();
            $ctrl.loadingInfoWindow = $ctrl.getLoadingInfoWindow();
            $window.mapBounds = new google.maps.LatLngBounds();

            google.maps.event.addListener($ctrl.map, 'click', $ctrl.closeInfoWindow);

            // Sets the boundaries of the map based on pin locations
            // Sets the boundaries of the map based on pin locations
            $window.addEventListener('resize', function(e) {
                // Make sure the map bounds get updated on page resize
                $ctrl.map.fitBounds($window.mapBounds);
            });
            return google;
        };
        /*
        * @description uses papaparse to parse location csv file.
        * @return {promise} for the results of the parsed data
        */
        $ctrl.fetchLocationData = function() {
            return PapaParse.parse('../../data/locations.csv');            
        };
        // Iterates through the array of locations, creates a search object for each location
        $ctrl.process = function(response) {
            // Start off with a promise that always resolves
            // var sequence = Promise.resolve();
            $ctrl.locations = response.data.slice(0, 5);
            $ctrl.locations.reduce(function(sequence, location) {
                // the search request object
                $ctrl.currentLocation = location;
                var request = {query: location.address};

                return Promise.resolve({request: request, location: location})
                .then($ctrl.textSearchCallback)
                .then($ctrl.createMapMarker);
            });
        };
        /*
        * @description callback(results, status) makes sure the search returned results for a location.
        If so, it creates a new map marker for that location.
        * @param {string} status - places api request status
        * @param {object} request - search request and the location
        */
        $ctrl.textSearchCallback = function(request) {
            return new Promise(function(resolve, reject) {
                var location = request.location;
                var req = request.request;
                $ctrl.service.textSearch(req, function(results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        resolve({placeData: results[0], location: location});
                    } else {
                        /* eslint-disable no-alert*/
                        return reject(status);
                    }
                });
            });
        };
        /*
        @description createMapMarker(placeData) reads Google Places search results to create map pins.
        placeData is the object returned from search results containing information
        about a single location.
        @param {object} response = placeData: results[0], location: location}
        */
        $ctrl.createMapMarker = function(response) {
            // The next lines save location data from the search result object to local variables
            var lat = response.placeData.geometry.location.lat();  // latitude from the place service
            var lon = response.placeData.geometry.location.lng();  // longitude from the place service
            var name = response.placeData.name;   // name of the place from the place service
            $ctrl.bounds = $window.mapBounds;            // current boundaries of the map window

            // marker is an object with additional data about the pin for a single location
            var marker = new google.maps.Marker({
                map: $ctrl.map,
                position: response.placeData.geometry.location,
                title: name,
                placeId: response.placeData.place_id,
                draggable: true,
                animation: google.maps.Animation.DROP,
                formatted_address: response.placeData.formatted_address
                // icon: placeData.icon
            });
            marker['infoWindow'] = new google.maps.InfoWindow({
                content: '<div>' +
                  '<div class="panel panel-default">' +
                    '<div class="panel-heading projectBg">' +
                      // '<h3 class="panel-title">Project: ' + location.name + '</h3>' +
                    '</div>' +
                    '<div class="panel-body">' +
                      '<p class="list-group-item" text="">Number of Employees:  ' + response.location.number_employees + '</p>' +
                      '<p class="list-group-item" text="">Location:  ' + response.location.address + '</p>' +
                    '</div>' +
                  '</div>' +
                '</div>'
            });
            // add markers to marker array
            $ctrl.markers.push(marker);
            // app.ViewModel.markers.push(marker);
        
            // add listener to respond to click events on markers
            google.maps.event.addListener(marker, 'click', function() {
                $ctrl.map.panTo(marker.getPosition());
                if ($ctrl.currentMarker) {
                    $ctrl.closeInfoWindow();
                }
                // stops bounce animation after 5 seconds
                var timeOut = setTimeout(function() {
                    marker.setAnimation(null);
                }, 5000);

                marker.infoWindow.open($ctrl.map, marker);
                $ctrl.currentMarker = marker;
            });
            // add listener to trigger bounce animation for marker icon after they have been clicked
            marker.addListener('click', $ctrl.toggleBounce);
        
            // this is where the pin actually gets added to the map.
            // bounds.extend() takes in a map location object
            $ctrl.bounds.extend(new google.maps.LatLng(lat, lon));
            // fit the map to the new marker
            $ctrl.map.fitBounds($ctrl.bounds);
           // center the map
            $ctrl.centerMap();
        };
          /**
          * @description get an instance of the information window for each marker that displays request details
          * @constructor
          */
        $ctrl.getInfoWindow = function() {
            var templateBinding =
            '<div id="info-window">' +
              '<h4>' + $ctrl.currentLocation.name + '</h4>' +
              '<h6><strong>The 3 other nearby places via Yelp</strong></h6>' +
              '<table class="table table-striped table-condensed" id="marker-tbl">' +
                '<thead><tr><th> Business </th><th> Rated </th>' +
                '<th class="hidden-xs"> Phone </th></tr> </thead>' +
                '<tbody data-bind="template: { name: \'business-template\', ' +
                'foreach: app.ViewModel.businesses, as: \'business\' }"></tbody>' +
                '</table>' +
            '</div>';
            $ctrl.isInfoWindowLoaded = false;
            return new google.maps.InfoWindow({
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
            return new google.maps.InfoWindow({
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
            return new google.maps.InfoWindow({
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
        * @description Closes information windows
        */
        $ctrl.closeInfoWindow = function() {
            $ctrl.currentMarker.infoWindow.close();
            $ctrl.currentMarker.setAnimation(null);

            // $ctrl.errorInfoWindow.close();
            // $ctrl.loadingInfoWindow.close();
        };
        $ctrl.toggleBounce = function() {
            $ctrl.markers.forEach(function(marker) {
                marker.setAnimation(null);
            });
            $ctrl.currentMarker.setAnimation(google.maps.Animation.BOUNCE);
        };
        /*
        * @description init() starts the application
        */
        $ctrl.init = function() {
            // The geocode type restricts the search to geographical location types.
            GoogleMapsLoader.KEY = ArbitratorConfig.apiKey;
            GoogleMapsLoader.LIBRARIES = ['places'];
            GoogleMapsLoader.SENSOR = false;
            return new Promise(function(resolve, reject){
                GoogleMapsLoader.load(resolve);
            });
        };
        $ctrl.$onInit = function() {
            $ctrl.init()
            .then($ctrl.googleLoad)
            .then($ctrl.fetchLocationData)
            .then($ctrl.process);
        };
    }]
});
