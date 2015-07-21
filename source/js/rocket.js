(function(Snap, $) {

    var rocket = {

        baseHref: $("base").attr("href"),

        attributes: {

            cloud:  {

                circle: {
                    fill: "rgba(255,255,255,0.6)",
                    stroke: "none",
                    strokeWidth: 0
                }

            }
        },

        init: function() {

            Snap.load(this.baseHref + "img/cloud.svg", function (img) {
                // canvas.append(img.node);
                $(img.node).appendTo("#contact").attr("id", "cloud");

                var elm = Snap(img.node);

                $("#contact").trigger("cloudLoaded", [img.node, elm]);
            });

            Snap.load(this.baseHref + "img/rocket.svg", function (img) {
                // canvas.append(img.node);
                $(img.node).appendTo("#contact").attr("id", "rocket");

                var elm = Snap(img.node);
                // elm.attr({ viewBox: "0 0 97.241 354.075" });

                $("#contact").trigger("rocketLoaded", [img.node, elm]);
            });

        }

    };

    rocket.init();

})( window.Snap, window.jQuery );
