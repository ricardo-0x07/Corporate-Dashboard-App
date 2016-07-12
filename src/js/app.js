'use strict';
/* jslint browser:true*/
/* eslint-disable no-unused-vars*/
/* global window, $, google, document, ko, Backbone, Handlebars, navigator, require, module, Promise */
/* eslint no-negated-condition: 2*/
var _ = require('underscore');
var Handlebars = require('handlebars');
var options = [];
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
require('backbone-relational');
global.jQuery = require('jquery');
require('bootstrap');
var mediator = require('./mediator');

var app = {
    start: function() {
        var AppRouter = require('./router');
        var mediator = require('./mediator');

        _.extend(Backbone.View.prototype, {
            // Handle cleanup of view.
            close: function() {
                console.log('Closing view ' + this);
                if (this.beforeClose) {
                    // Perform any cleanup specific to this view.
                    this.beforeClose();
                }
                if (this.model) {
                    // Remove all callbacks for this view's model.
                    this.model.off(null, null, this);
                    this.model = null;
                }
                // Something else might be named 'collection' so also check for the
                // existence of `off`
                if (this.collection && this.collection.off) {
                    // Remove all callbacks for this view's collection.
                    this.collection.off(null, null, this);
                    this.collection = null;
                }
                // Remove all delegated events.
                this.undelegateEvents();
                this.off(null, null, this);
                // this.remove();
                // Remove all markup.
                this.$el.empty();
            }
        });

        Backbone.Relational.store.addModelScope(app.models);

        app.router = new AppRouter();

        Backbone.history.start({pushState: false});

        if (Backbone.history.fragment === '') {
            mediator.trigger('router:navigate', {route: 'home', options: {trigger: true}});
        }
    },
    models: {}
};

module.exports = app;
