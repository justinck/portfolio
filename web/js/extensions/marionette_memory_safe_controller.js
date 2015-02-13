define([
    'marionette',
    './marionette_clean_props'
], function(Marionette, marionetteCleanProps) {
    Marionette.Controller.prototype.destroy = function() {
        var args =  Array.prototype.slice.call(arguments);
        this.triggerMethod.apply(this, ['before:destroy'].concat(args));

        marionetteCleanProps.call(this);
        this.triggerMethod.apply(this, ['destroy'].concat(args));
        this.stopListening();
        this.off();
        return this;
    };
});
