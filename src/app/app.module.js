/* global angular */
'use strict';
global.jQuery = require('jquery');
require('bootstrap');
require('angular');
require('angular-mocks');
require('angular-material');
require('angular-animate');
require('angular-messages');
require('./components/dashboard/dashboard.module');
require('./components/dashboard-dataview/dashboard-dataview.module');
require('./components/dashboard-dataview/dashboard-dataview.component');
require('./components/dashboard-keymetrics/dashboard-keymetrics.module');
require('./components/dashboard-keymetrics/dashboard-keymetrics.component.js');
require('./components/dashboard-geospacial/dashboard-geospacial.module');
require('./components/navigation-bar/navigation-bar.module');
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
      });

      $stateProvider.state({
          name: 'dashboard.geospacial',
          url: '/dashboard/geospacial',
          views: {
              geospacial: {component: 'dashboardGeospacial'}
          }
      });

      $stateProvider.state({
          name: 'dashboard.dataview',
          url: '/dashboard/dataview',
          views: {
              dataview: {component: 'dashboardDataview'}
          }
      });

      $stateProvider.state({
          name: 'dashboard.keymetrics',
          url: '/dashboard/keymetrics',
          views: {
              keymetrics: {component: 'dashboardKeymetrics'}
          }
      });
  }
]);

