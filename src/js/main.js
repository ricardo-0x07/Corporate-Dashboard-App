'use strict';
/* jslint browser:true*/
/* eslint-disable no-unused-vars*/
/* global window, $, google, document, ko, Backbone, Handlebars, navigator, require */
/* eslint no-negated-condition: 2*/
require('./controllers/IndexController.js');
var _ = require('underscore');
var Handlebars = require('handlebars');
var options = [];
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var App = require('./app');

App.start();
