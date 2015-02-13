define([
    './controller',
    'marionette.viewrouter'
], function(Controller, ViewRouter) {
    return ViewRouter.extend({
        routes: {
            '*all(/:page)': 'home'
        },
        home: function(page) {
            if (this.controller) {
                this.controller.destroy();
            }

            this.controller = new Controller({
                page: page
            });
            return this.controller.getView();
        }
    });
});
