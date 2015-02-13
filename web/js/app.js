/*global define */
define([
    'jquery',
    'marionette',
    'backbone',
    'underscore',
    'Handlebars',
    // Side effects
    'extensions/marionette_memory_safe_controller'
], function($, Marionette, Backbone, _, Handlebars) {
    // Start up a new Marionette Application
    var App = new Marionette.Application();

    // Add regions
    App.addRegions({
        appRegion: '#app'
    });

    // Fires after the Application has started and after the initializers
    // have been executed.
    App.on('start', function() {
        // Load all modules with routers
        require([
            // Example app
            'apps/justin/router'
        ], function(Router) {
            new Router({
                region: App.appRegion
            });

            // Start the history. All modules with routing must be loaded in the
            // above require call.
            if (Backbone.history) {
                Backbone.history.start({
                    pushState: true
                });
            }
        });
    });

    App.globals = {
        breakpoints: {
            tablet: 768,
            desktopSmall: 960,
            desktop: 1100,
            desktopLarge: 1440
        },
        $window: $(window),
        $document: $(document),
        $htmlBody: $('html, body')
    };

    App.cacheDimensions = function() {
        if (!this.dimensions) {
            this.dimensions = {};
        }
        if (!this.dimensions.window) {
            this.dimensions.window = {};
        }
        if (!this.dimensions.document) {
            this.dimensions.document = {};
        }
        this.dimensions.window.height = this.globals.$window.height();
        this.dimensions.window.width = this.globals.$window.width();
        this.dimensions.document.height = this.globals.$document.height();
    };

    App.on('before:start', function() {
        this.cacheDimensions();
        this.globals.$window.on('resize.app', _.debounce(function() {
            this.cacheDimensions();
            this.trigger('app:resize');
        }.bind(this), 1000));
    });

    // Wrapper for `Backbone.history.navigate`.
    App.navigate = function(route,  options) {
        Backbone.history.navigate(route, options);
    };

    // Wrapper for `Backbone.history.fragment`.
    App.getCurrentRoute = function() {
        return Backbone.history.fragment;
    };

    // Allow logging in handlebar templates
    // ex: {{ log this }}
    Handlebars.registerHelper('log', function(context) {
        return window.console.log(context);
    });

    // Return the application instance.
    return App;
});
