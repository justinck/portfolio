define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    return function() {
        _.chain(this).keys().each(function(prop) {
            var obj;
            obj = this[prop];
            // Don't destroy Backbone Models, that'll actually delete
            // them on the server
            if (obj.destroy && !(obj instanceof Backbone.Model)) {
                obj.destroy();
                delete this[prop];
            // Check for Backbone.Events
            } else if (obj.on) {
                obj.off().stopListening();
                delete this[prop];
            }
        }, this);
    };
});
