/* global angular, google */
'use strict';

var GoogleMapsLoader = require('google-maps');
var ArbitratorConfig = require('../../../assets/js/config');

angular.module('core.googleMap')
.component('googleMap', {
    templateUrl: '/core/google-map/google-map.template.html',
    controller: ['$window', 'PapaParse', '$interval', function GoogleMapController($window, PapaParse, $interval) {
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
            $ctrl.locations = response.data;
            console.log('$ctrl.locations', $ctrl.locations);
            $ctrl.locations.map(function(location) {
                console.log('location', location);
                // the search request object
                $ctrl.currentLocation = location;
                return Promise.resolve(location)
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
            var lat = parseFloat(response.location_latitude);  // latitude from the place service
            var lon = parseFloat(response.location_longitude);  // longitude from the place service
            var latlng = new google.maps.LatLng(lat, lon);
            var name = response.address;   // name of the place from the place service
            $ctrl.bounds = $window.mapBounds;            // current boundaries of the map window

            // marker is an object with additional data about the pin for a single location
            var marker = new google.maps.Marker({
                map: $ctrl.map,
                position: latlng,
                title: name,
                placeId: response.id,
                draggable: true,
                animation: google.maps.Animation.DROP,
                formatted_address: response.address,
                lon: lon,
                lat: lat,
                loc: response
                // icon: placeData.icon
            });
            marker.infoWindow = $ctrl.getInfoWindow(response);
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
        $ctrl.getInfoWindow = function(location) {
            return new google.maps.InfoWindow({
                content: '<div>' +
                  '<div class="panel panel-default">' +
                    '<div class="panel-heading projectBg">' +
                      '<h3 class="panel-title">Location: ' + location.address + '</h3>' +
                    '</div>' +
                    '<div class="panel-body">' +
                      '<p class="list-group-item" text="">Number of Employees:  ' + location.number_employees + '</p>' +
                    '</div>' +
                  '</div>' +
                '</div>'
            });
        };
        $ctrl.setInfoWindowContent = function(location) {
            return '<div>' +
                  '<div class="panel panel-default">' +
                    '<div class="panel-heading projectBg">' +
                      '<h3 class="panel-title">Location: ' + location.address + '</h3>' +
                    '</div>' +
                    '<div class="panel-body">' +
                      '<p class="list-group-item" text="">Number of Employees:  ' + location.number_employees + '</p>' +
                    '</div>' +
                  '</div>' +
                '</div>';
        };
        $ctrl.updateInfoWindow = function(location) {
            $ctrl.markers.forEach(function(marker, index) {
                if (marker.placeId === location.id) {
                    console.log('marker', marker);
                    if (marker.loc.number_employees !== location.number_employees || marker.loc.address !== location.address) {
                        var content = $ctrl.setInfoWindowContent(location);
                        marker.infoWindow.setContent(content);
                        marker.loc = location;
                    }
                    // The next lines save location data from the search result object to local variables
                    var lat = parseFloat(location.location_latitude);  // latitude from the place service
                    var lon = parseFloat(location.location_longitude);  // longitude from the place service
                    // var latlng2 = new google.maps.LatLng(lat, lon);
                    console.log('marker.lon', marker.lon);
                    console.log('lon', lon);
                    console.log('marker.lat', marker.lat);
                    console.log('lat', lat);
                    if (marker.lon !== lon || marker.lat !== lat) {
                        console.log('index', index);
                        console.log('$ctrl.markers[index]', $ctrl.markers[index]);
                        $ctrl.markers[index].setMap(null);
                        $ctrl.markers[index] = null;
                        $ctrl.markers.splice(index, 1);

                        $ctrl.createMapMarker(location);
                    }
                }
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
            $ctrl.stop = true;
            return (true);
        };
        /*
        * @description Closes information windows
        */
        $ctrl.closeInfoWindow = function() {
            $ctrl.currentMarker.infoWindow.close();
            $ctrl.currentMarker.setAnimation(null);
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
            })
            .then($ctrl.googleLoad)
            .then($ctrl.fetchLocationData)
            .then($ctrl.process);
        };
        $ctrl.$onInit = function() {
            $ctrl.init();
        };
        $ctrl.startLongPolling = $interval(function() {
            $ctrl.fetchLocationData()
            .then(function(response) {
                var locations = response.data;
                locations.forEach(function(location){
                    $ctrl.updateInfoWindow(location);
                    // $ctrl.createMapMarker(location);
                });
            });
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
    }]
});
