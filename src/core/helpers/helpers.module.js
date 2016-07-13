'use strict';

var angular = require('angular');

module.exports = angular.module('core.ProgressTrackerService', [])
    .factory('ProgressTrackerService', ['$window', function($window) {
        this.track = {};
        this.track.track = function(selector) {
            // Here set up to track form completion
            var inputs = [];
            var increment = 100 / selector.length;
            selector.each(function(index, element) {
                inputs.push({element: element, amount: increment});
            });

            // Set up the logic to change the progress bar
            var progressBar = $window.document.querySelector('paper-progress.transiting');
            /** @description Track the progress of the form
            * @param {number} inputs - list of inputs for validation tracking.
            * @param {object} progressBar - progress bar to be updated
            */
            console.log('progressBar', progressBar);
            console.log('inputs', inputs);
            function ProgressTracker(inputs, progressBar) {
                var _this = this;
                this.progressBar = progressBar;
                this.inputs = inputs;

                this.inputs.forEach(function(input) {
                    input.added = false;
                    input.isValid = null;
                    input.element.onblur = function() {
                        console.log('onBlur');
                        this.validate();
                        input.isValid = _this.determineStatus(input);
                        _this.adjustProgressIfNecessary(input);
                    };
                });
            }

            ProgressTracker.prototype = {
                determineStatus: function(input) {
                    var isValid = false;

                    if (input.element.value.length > 0) {
                        isValid = true;
                    } else {
                        isValid = false;
                    }

                    try {
                        isValid = isValid && input.element.validate();
                    } catch (e) {
                        console.log(e);
                    }

                    return isValid;
                },
                adjustProgressIfNecessary: function(input) {
                    var newAmount = this.progressBar.value;

                    if (input.added && !input.isValid) {
                        newAmount -= input.amount;
                        input.added = false;
                    } else if (!input.added && input.isValid) {
                        newAmount += input.amount;
                        input.added = true;
                    }

                    this.progressBar.value = newAmount;
                }
            };

            /* eslint-disable no-unused-vars*/
            var progressTracker = new ProgressTracker(inputs, progressBar);
        };
        return this.track;
    }]);
