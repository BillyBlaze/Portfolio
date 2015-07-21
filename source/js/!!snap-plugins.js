(function() {
    Snap.plugin(function(Snap, Element, Paper, global) {

        Element.prototype.drawAtPath = function(path, text, timer, options) {

            var myObject = this,
                bbox = this.getBBox(1);
            var point, movePoint = {},
                len = path.getTotalLength(),
                from = 0,
                to = len,
                drawpath = 0,
                easing = mina.linear,
                callback;
            var startingTransform = '';

            if (options) {
                easing = options.easing || easing;
                if (options.reverse) {
                    from = len;
                    to = 0;
                };
                if (options.drawpath) {
                    drawpath = 1;
                    path.attr({
                        fill: "none",
                        strokeDasharray: len + " " + len,
                        strokeDashoffset: this.len
                    });

                };
                if (options.startingTransform) {
                    startingTransform = options.startingTransform;
                };
                callback = options.callback || function() {};
            };

            return Snap.animate(from, to, function(val) {
                point = path.getPointAtLength(val);
                movePoint.x = point.x - bbox.cx;
                movePoint.y = point.y - bbox.cy;
                myObject.transform(startingTransform + 't' + movePoint.x + ',' + movePoint.y + 'r' + point.alpha);

                if (drawpath) {
                    path.attr({
                        "stroke-dashoffset": len - val
                    });
                };

                if(text !== null) {
                    var textPoint = {};
                    textPoint.x = movePoint.x - (text.node.getBBox().width / 2);
                    textPoint.y = movePoint.y;
                    text.transform(startingTransform + 't' + textPoint.x + ',' + textPoint.y + " r12");
                }

            }, timer, easing, callback);
        };
    });

    Snap.plugin(function(Snap, Element, Paper, global) {
        Paper.prototype.circlePath = function(cx, cy, r, offset) {
            var p = "M" + cx + "," + cy;
                p += "m" + -r + ", " + (offset*(r/37.5));
                p += "a" + r + "," + (r / 2) + " 0 1, 1 " + (r * 2) + ", 0";
                p += "a" + r + "," + (r / 2) + " 0 1, 1 " + -(r * 2) + ", 0";
                // A rx,ry xAxisRotate LargeArcFlag,SweepFlag x,y

            return this.path(p, cx, cy);
        };
    });

})();
