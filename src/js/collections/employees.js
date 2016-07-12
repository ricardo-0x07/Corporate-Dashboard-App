/* global module, require */
'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
require('backbone-relational');
Backbone.$ = $;
// var Employee = require('../models/personModel');
var app = require('../app');

app.models.Employee = Backbone.RelationalModel.extend({
    urlRoot: '/api/employees/',
    url: function() {
        if (this.isNew() && !this.id) {
            return this.urlRoot;
        }
        return this.urlRoot + this.id + '/';
    },
    relations: [
        {
            type: Backbone.HasOne,
            key: 'employer',
            includeInJSON: 'id',
            relatedModel: 'Company',
            reverseRelation: {
                key: 'employees',
                type: Backbone.HasMany,
                relatedModel: 'Employee',
                collectionType: 'Employees'
            }
        }
    ],
    defaults: {
        name: '',
        email: '',
        cellPhone: '',
        officePhone: '',
        fax: '',
        address: '',
        gender: '',
        profession: '',
        position: '',
        password: ''
    },
    idAttribute: 'id',
    initialize: function() {
        console.log('A model instance named ' + this.get('name') + ' has been created.');
    }
});

app.models.Employees = Backbone.Collection.extend({
    url: '/api/employees',
    model: app.models.Employee,
    add: function(data) {
        var self = this;
        // var data = object.data;
        // console.log('Project', Project);
        console.log(app.models.Employees);
        if (data !== null) {
            if (Array.isArray(data)) {
                console.log('Array of models:');
                console.log(data);
                data.forEach(function(item) {
                    if (!self.findWhere({name: item.name})) {
                        console.log('item: ' + item.name + ' added.');
                        Backbone.Collection.prototype.add.call(self, item);
                    }
                });
            } else {
                console.log('model:');
                console.log(data);
                if (!self.findWhere({name: data.name})) {
                    console.log('item: ' + data.name + ' added.');
                    Backbone.Collection.prototype.add.call(self, data);
                }
            }
            console.log('self:');
            console.log(self);
        }
    }
});

module.exports = new app.models.Employees();
