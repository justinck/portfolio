define([
    'underscore',
    'jquery',
    //side effects
    './raf'
], function(_, $) {
    var STOP_CHANGE_INTERVAL = 1000;

    var $window = $(window);

    return function(draw, active) {
        var api;
        var colors;
        var fnAnimate;
        var fnSetInterval;
        var fnStopStops;
        var gradient;
        var interval;
        var s1;
        var s2;
        var s3;
        var stops;

        colors = ['#EFFF22', '#D1FBFF', '#2759FF'];

        gradient = draw.gradient('linear', function(stop) {
            s1 = stop.at(0, colors[0]);
            s2 = stop.at(0.4, colors[1]);
            s3 = stop.at(1, colors[2]);
            stops = [s1, s2, s3];
        });

        fnAnimate = function() {
            var color;
            var stop;

            color = _.sample(colors);
            stop = _.sample(stops);
            stop.animate().update({
                color: color
            });
        };

        fnStopStops = function() {
            _.each(stops, function(stop) {
                stop.stop();
            });
        };

        fnSetInterval = function() {
            return setInterval(function() {
                fnAnimate();
            }, STOP_CHANGE_INTERVAL);
        };

        if (typeof active === 'undefined') {
            active = true;
        }

        if (active) {
            interval = fnSetInterval();
        }

        api = {
            gradient: gradient,
            stop: function() {
                active = false;
                clearInterval(interval);
                fnStopStops();
            },
            start: function(timer) {
                active = true;
                clearInterval(interval);
                if (typeof timer === 'undefined') {
                    timer = true;
                }
                if (timer) {
                    interval = fnSetInterval();
                }
            }
        };

        $window.on('scrollstart', function() {
            clearInterval(interval);
            fnStopStops();
        });
        $window.on('scrollstop', function() {
            if (!active) {
                return;
            }
            clearInterval(interval);
            interval = fnSetInterval();
        });

        return api;
    };
});
