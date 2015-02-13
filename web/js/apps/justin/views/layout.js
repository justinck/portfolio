define([
    'jquery',
    'underscore',
    'app',
    'marionette',
    'hbars!../templates/layout',
    'modernizr'
], function($, _, app, Marionette, template) {
    return Marionette.LayoutView.extend({
        template: template,
        className: 'layout',
        regions: {
        },
        ui: {
        },
        initialize: function() {
        },
        onRender: function() {
        }
    });
});
