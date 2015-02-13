define([
    // Basic dependencies
    'underscore',
    'app',
    'marionette',
    './views/layout'
], function(_, app, Marionette, LayoutView) {

    return Marionette.Controller.extend({
        initialize: function(options) {
            this.layoutView = new LayoutView();

        },
        getView: function() {
            return this.layoutView;
        }
    });
});
