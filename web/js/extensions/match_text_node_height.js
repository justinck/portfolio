define([
    'jquery'
], function($) {
    var $cache = [];
    return function(draw, text) {
        var $node;
        var height;
        var id;
        var width;

        id = text.node.id;
        if (!$cache[id]) {
            $cache[id] = $(text.node);
        }
        $node = $cache[id];

        height = $node.height();
        width = $node.width();
        draw.size(width, height);
        return {
            height: height,
            width: width
        };
    };
});
