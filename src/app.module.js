'use strict';
global.jQuery = require('jquery');
require('bootstrap');
var angular = require('angular');
require('angular-material');
require('angular-animate');
require('angular-messages');
// var globals = require('./js/globals');
require('./dashboard/dashboard.module');
require('./dashboard-dataview/dashboard-dataview.module');
require('./dashboard-keymetrics/dashboard-keymetrics.module');
require('./dashboard-geospacial/dashboard-geospacial.module');
require('./navigation-bar/navigation-bar.module');
require('./core/core.module');
require('angular-ui-bootstrap');
require('angular-google-maps');
require('ui-router-extras');

var dependencies = [
    require('angular-ui-router').default,
    'dashboardDataview',
    'dashboardKeymetrics',
    'dashboardGeospacial',
    'dashboard',
    'ui.bootstrap',
    'ngMaterial',
    'ngMessages',
    'navigationBar',
    'core'
];

var corporateDashboardApp = angular.module('corporateDashboardApp', dependencies);

corporateDashboardApp.config(['$locationProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider',
  function($locationProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/dashboard');


      $stateProvider.state({
          name: 'dashboard',
          url: '/dashboard',
          component: 'dashboard'
          // views: {
          //     '': {component: 'dashboard'},
          //     'geospacial@dashboard': {component: 'dashboardGeospacial'},
          //     'dataview@dashboard': {component: 'dashboardDataview'},
          //     'keymetrics@dashboard': {component: 'dashboardKeymetrics'}
          // }
      });

      $stateProvider.state({
          name: 'dashboard.geospacial',
          url: '/dashboard/geospacial',
          views: {
              'geospacial': {component: 'dashboardGeospacial'}
          }
      });

      $stateProvider.state({
          name: 'dashboard.dataview',
          url: '/dashboard/dataview',
          views: {
              'dataview': {component: 'dashboardDataview'}
          }
      });

      $stateProvider.state({
          name: 'dashboard.keymetrics',
          url: '/dashboard/keymetrics',
          views: {
              'keymetrics': {component: 'dashboardKeymetrics'}
          }
          // component: 'dashboardKeymetrics'
      });
  }
]);

