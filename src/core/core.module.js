'use strict';

var angular = require('angular');
require('./helpers/helpers.module');
require('./google-map/google-map.module');
require('./google-chart-issuestrend/google-chart-issuestrend.module');
require('./google-chart-projecttrends/google-chart-projecttrends.module');

module.exports = angular.module('core', ['core.googleMap', 'core.googleChartIssuestrend', 'core.googleChartProjecttrends']);
