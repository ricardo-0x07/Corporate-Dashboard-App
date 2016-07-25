/* global angular */
'use strict';

angular.module('core.api', [])
    .factory('APIService', ['$http', function($http) {
        return {

            get: function(url) {
                return $http({
                    method: 'GET',
                    url: url
                })
                .then(function(data) {
                    return data;
                })
                .catch(function(data) {
                    console.log('Error: GET ' + url);
                    console.log(data);
                });
            }
        }; // return object
        // return {
    }]); // .factory
