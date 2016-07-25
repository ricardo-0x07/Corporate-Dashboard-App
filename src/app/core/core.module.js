/* global angular */
'use strict';

require('./helpers/helpers.module');
require('./google-map/google-map.module');
require('./google-map/google-map.component');
require('./google-chart-issuestrend/google-chart-issuestrend.module');
require('./google-chart-issuestrend/google-chart-issuestrend.component');
require('./google-chart-customertrends/google-chart-customertrends.module');
require('./google-chart-customertrends/google-chart-customertrends.component');
require('./papa-parse/papa-parse.module');
require('./papa-parse/papa-parse.service');
require('./api/api.module');

angular.module('core', ['core.papaParse', 'core.googleMap', 'core.googleChartIssuestrend', 'core.googleChartCustomertrends', 'core.api']);
