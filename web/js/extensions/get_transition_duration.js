define([
    'jquery',
    'underscore',
    'modernizr'
], function($, _, Modernizr) {
    function getPropertyIndex(cssTransitionProperty, desired) {
        var transitionProperties;
        transitionProperties = cssTransitionProperty.split(',');

        // Default to first property defined
        if (_.isUndefined(desired)) {
            return 0;
        }

        return _.find(transitionProperties, function(property, index) {
            if (property === desired) {
                return index;
            }
        });
    }

    function getTransitionDurationAtIndex(cssTransitionDuration, index) {
        var transitionDurations;

        transitionDurations = cssTransitionDuration.split(',');
        return transitionDurations[index].trim();
    }

    return function($el, property) {
        var propertyIndex;
        var transitionDuration;

        if (!Modernizr.csstransitions) {
            return 0;
        }
        if (!($el instanceof $)) {
            $el = $($el);
        }

        propertyIndex = getPropertyIndex($el.css('transition-property'), property);
        transitionDuration = getTransitionDurationAtIndex($el.css('transition-duration'), propertyIndex);
        return parseFloat(transitionDuration) * 1000;
    };
});
