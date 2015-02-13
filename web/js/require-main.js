/*globals requirejs */

(function(undefined) {
    'use strict';

    define('ga', function() {
        return window.ga;
    });

    requirejs.config({
        paths: {
            backbone: '../vendor/backbone/backbone',
            'backbone.babysitter': '../vendor/backbone.babysitter/lib/backbone.babysitter',
            'backbone-view-model': '../vendor/backbone-view-model/src/view-model',
            'backbone.wreqr': '../vendor/backbone.wreqr/lib/backbone.wreqr',
            Handlebars: '../vendor/handlebars/handlebars',
            hbars: '../vendor/requirejs-handlebars/hbars',
            jquery: '../vendor/jquery/dist/jquery',
            marionette: '../vendor/backbone.marionette/lib/core/backbone.marionette',
            'marionette.viewrouter': '../vendor/marionette.viewrouter/src/marionette.viewrouter',
            modernizr: '../vendor/modernizr/modernizr',
            text: '../vendor/requirejs-text/text',
            TimelineMax: '../vendor/gsap/src/uncompressed/TimelineMax',
            TweenMax: '../vendor/gsap/src/uncompressed/TweenMax',
            TweenLite: '../vendor/gsap/src/uncompressed/TweenLite',
            underscore: '../vendor/underscore/underscore'
        },
        shim: {
        },
        hbars: {
            extension: '.hbs'
        },
        waitSeconds: 0
    });
    require(['app'], function(App) {
        App.start();
    });
}());
