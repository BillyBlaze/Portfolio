(function(Snap, $) {

    var skills = {

        baseHref: $("base").attr("href"),

        canvas: {
            width: 600,
            height: 600,

            middleX: 300,
            middleY: 300,

            main: Snap("#skillsMain"),
            star: Snap("#skillsSun"),
            planets: Snap("#skillsMoons"),
            texts: Snap("#skillsText"),
            orbits: Snap("#skillsOrbit"),
        },

        attributes: {

            blackhole: {
                fill: "#000",
                stroke: "#FFF",
                strokeWidth: 0
            },

            planets: {

                text: {
                    fill: "#CCC"
                },

                objects: {
                    fill: "#888",
                    strokeWidth: 0
                },

                orbits: {
                    fill: "none",
                    stroke: "#888",
                    strokeWidth: 1
                }

            },

            hover: {
                fill: "#FFF"
            },

            unhover: {
                fill: "#888"
            },

            overlay:  {

                circle: {
                    fill: "none",
                    stroke: "#00a2ff",
                    strokeWidth: 150
                }

            }
        },

        blackhole: null,
        texts: [],
        planets: [],
        orbits: [],
        animations: [],

        windowActive: false,
        navigationUsed: false,

        overlay: {

            circle1: null,
            circle2: null,
            circle3: null,
            circleGroup: null,
            circleMask: null,
            circleMaskGroup: null

        },

        init: function() {
            var self = this;

            // Make SVG resposive
            this.canvas.main.attr({ viewBox: "0 0 "+this.canvas.width+" "+this.canvas.height });
            this.canvas.star.attr({ viewBox: "0 0 "+this.canvas.width+" "+this.canvas.height });
            this.canvas.planets.attr({ viewBox: "0 0 "+this.canvas.width+" "+this.canvas.height });
            this.canvas.texts.attr({ viewBox: "0 0 "+this.canvas.width+" "+this.canvas.height });

            this.scene.starMap.call(this);
            this.scene.overlay.call(this);
            this.animations.skills.call(this);

        },

        scene: {

            starMap: function() {

                // Create a blackhole
                this.blackhole = this.canvas.main.circle("50%", "50%", 40).attr(this.attributes.blackhole);

                // List of DOM IDs
                this.idList = ["frontend", "libraries", "tools", "backend"];

                // Create text node above a planet
                this.texts = [];
                this.texts.push(this.canvas.texts.text(this.canvas.middleX, this.canvas.middleY, "Front-end").attr(this.attributes.planets.text));
                this.texts.push(this.canvas.texts.text(this.canvas.middleX, this.canvas.middleY, "Libraries").attr(this.attributes.planets.text));
                this.texts.push(this.canvas.texts.text(this.canvas.middleX, this.canvas.middleY, "Tools").attr(this.attributes.planets.text));
                this.texts.push(this.canvas.texts.text(this.canvas.middleX, this.canvas.middleY, "Back-end").attr(this.attributes.planets.text));

                // Create planets
                this.planets = [];
                this.planets.push(this.canvas.planets.circle(this.canvas.middleX, this.canvas.middleY, 2).attr(this.attributes.planets.objects));
                this.planets.push(this.canvas.planets.circle(this.canvas.middleX, this.canvas.middleY, 2).attr(this.attributes.planets.objects));
                this.planets.push(this.canvas.planets.circle(this.canvas.middleX, this.canvas.middleY, 2).attr(this.attributes.planets.objects));
                this.planets.push(this.canvas.planets.circle(this.canvas.middleX, this.canvas.middleY, 2).attr(this.attributes.planets.objects));

                // Create orbits paths
                this.orbits = [];
                this.orbits.push(this.canvas.planets.circlePath(this.canvas.middleX, this.canvas.middleY, 130, 1, 1).attr(this.attributes.planets.orbits));
                this.orbits.push(this.canvas.planets.circlePath(this.canvas.middleX, this.canvas.middleY, 175, 2, 2).attr(this.attributes.planets.orbits));
                this.orbits.push(this.canvas.planets.circlePath(this.canvas.middleX, this.canvas.middleY, 250, 3, 4).attr(this.attributes.planets.orbits));
                this.orbits.push(this.canvas.planets.circlePath(this.canvas.middleX, this.canvas.middleY, 290, 4, 5).attr(this.attributes.planets.orbits));
                this.orbits.push(this.canvas.planets.circlePath(this.canvas.middleX, this.canvas.middleY, 3000, 5, 200).attr(this.attributes.planets.orbits));

                // Create animations along path
                this.animations.orbit.call( this, 10000 * 20, this.planets[0], this.orbits[0], this.texts[0], 0, 200 );
                this.animations.orbit.call( this, 10000 * 25, this.planets[1], this.orbits[1], this.texts[1], 1, 450 );
                this.animations.orbit.call( this, 10000 * 40, this.planets[2], this.orbits[2], this.texts[2], 2, 610 );
                this.animations.orbit.call( this, 10000 * 60, this.planets[3], this.orbits[3], this.texts[3], 3, 120 );
                this.animations.orbit.call( this, 10000 * 100, this.canvas.planets.circle(3000, 3000, 3), this.orbits[4], null, 4, 0 );

                // Create hover events
                for(var i = 0; i < 4; i++) {
                    this.texts[i].hover(
                        this.events.moon.hover.bind(this, this.idList[i], this.planets[i], this.orbits[i], this.texts[i], i),
                        this.events.moon.unhover.bind(this, this.idList[i], this.planets[i], this.orbits[i], this.texts[i], i)
                    );
                    this.texts[i].click(
                        this.events.moon.click.bind(this, this.idList[i], this.planets[i], this.orbits[i], this.texts[i], i)
                    );
                }

            },

            overlay: function() {

                // Create circles
                this.overlay.circle1 = this.canvas.orbits.circle("50%", "50%", 0).attr(this.attributes.overlay.circle);
                this.overlay.circle2 = this.canvas.orbits.circle("50%", "50%", 0).attr(this.attributes.overlay.circle);
                this.overlay.circle3 = this.canvas.orbits.circle("50%", "50%", 0).attr({fill: this.attributes.overlay.circle.stroke});

                // Group cicles
                this.overlay.circleGroup = this.canvas.orbits.group(this.overlay.circle1, this.overlay.circle2, this.overlay.circle3);

                // Create circle mask
                this.overlay.circleMask = this.canvas.orbits.rect(0, 170, "100%", 700).attr({
                    fill: "#FFF"
                });

                // Group mask
                this.overlay.circleMaskGroup = this.canvas.orbits.group(this.overlay.circleMask);

                // Apply Mask
                this.overlay.circleGroup.attr({
                  mask: this.overlay.circleMaskGroup
                });

                // Create skill chart
                this.skillChart = this.canvas.main.path("");
            }

        },

        animations: {

            experienceBar: function(percent, back) {

                var self = this,
                    canvasSize = 600,
                    centre = 300,
                    radius = 86,
                    path = "",
                    startY = centre+radius,
                    startpoint = this.startPoint || 0;

                self.startPoint = percent;

                percent = parseFloat(percent/10);
                startpoint = parseFloat(startpoint/10);

                // var endpoint = percent * 360;
                var endpoint = percent * 359.99,
                    duration = (startpoint > percent) ? startpoint-percent : percent-startpoint;

                if (self.skillExpAnimation !== undefined && self.skillExpAnimation !== null) {
                    self.skillExpAnimation.stop();
                }

                self.skillExpAnimation = Snap.animate((startpoint * 359.99), endpoint, function (val) {
                    self.skillChart.remove();

                    var d = val,
                        radians = Math.PI * ((360 - d) - 90) / 180,
                        endx = centre - radius * Math.cos(radians),
                        endy = centre - radius * Math.sin(radians),
                        largeArc = d>180 ? 1 : 0;
                        path = "M"+centre+","+startY+" A"+radius+","+radius+" 1 "+largeArc+",0 "+endx+","+endy;

                    self.skillChart = self.canvas.main.path(path);
                    self.skillChart.insertBefore(self.blackhole);
                    self.skillChart.attr({
                      stroke: '#fff',
                      fill: 'none',
                      strokeWidth: 8
                    });

                }, (back) ? 300 : duration * 1200, (back) ? mina.bounce : mina.easeinout);

            },

            orbit: function( timer, el, path, text, i, offset ) {
                var self = this;

                self.animations[i] = el.drawAtPath( path, text, timer, { callback: self.animations.orbit.bind(self, timer, el, path, text, i, null) } );

                if(offset !== null) {
                    self.animations[i].start = offset;
                    self.animations[i].update();
                }
            },

            skills: function() {

                // Create mask
                var rect = [];
                rect[1] = this.canvas.main.rect(300, 0, "50%", "100%").attr({fill:"#FFF"}),
                rect[2] = this.canvas.main.rect(260, 0, 30, "100%").attr({fill:"#FFF"}),
                rect[3] = this.canvas.main.rect(225, 0, 25, "100%").attr({fill:"#FFF"}),
                rect[4] = this.canvas.main.rect(195, 0, 20, "100%").attr({fill:"#FFF"}),
                rect[5] = this.canvas.main.rect(170, 0, 15, "100%").attr({fill:"#FFF"}),
                rect[6] = this.canvas.main.rect(150, 0, 10, "100%").attr({fill:"#FFF"});

                // Create subtitle
                this.skillsSubtitle = this.canvas.main.text(-600, 370, "");
                this.skillsGroup = this.canvas.main.group().attr({ id: "cont" });
                this.skillsGroup2 = this.canvas.main.group().attr({ id: "cont2" });

                // Group mask
                this.skillsGroupMask = this.canvas.main.group(rect[1], rect[2], rect[3], rect[4], rect[5], rect[6]);

                // Apply Mask
                this.skillsGroup.attr({
                    mask: this.skillsGroupMask
                });

            },

        },

        events: {

            overlay: {

                close: function() {
                    var self = this;

                    self.windowActive = false;

                    // Animate circle1 instant
                    self.overlay.circle3.animate({
                        r: 0
                    }, 700, mina.easeout);

                    $.each(self.circles.concat(self.circles2), function(ind, elm) {
                        elm.animate({
                            r: 0
                        }, 600, mina.easeout);
                    });

                    self.animations.experienceBar.call(self, 0, true);

                    self.blackhole.animate({
                        r: 20
                    }, 400, mina.easeinout,function() {

                        self.blackhole.animate({
                            r: 40
                        }, 1200, mina.elastic, function() {
                            $("#skillsText").attr("class", "active");
                            $("#skillsOrbit").attr("class", "");
                            $("#skillsMain").attr("class", "");
                        });

                    });

                    self.closeCircles.animate({
                        r: 0
                    }, 300, null, function() {
                        $(self.closeCircleGroup.node).remove();
                    });

                    self.closeText.animate({
                        opacity: 0
                    }, 150);

                    self.navigationGroup.animate({
                        opacity: 0
                    }, 600, null, function() {
                        $(self.navigationGroup.node).remove();
                    });

                    self.skillsGroupMask.animate({
                        transform: "translate(500, 0)"
                    }, 500);

                    // Animate circle2 after 100 delay
                    window.setTimeout(function(){

                        self.overlay.circle2.animate({
                            r: 0
                        }, 600, mina.easeout);

                    }, 200);

                    // Animate circle3 after 600 delay
                    window.setTimeout(function(){

                        self.overlay.circle1.animate({
                            r: 0
                        }, 600, mina.easeout);

                        self.skillsTitle.animate({
                            x: -700
                        }, 500, mina.elastic, function() {

                            self.skillsTitle.remove();
                            self.skillsSubtitle.attr({
                                x: -2000
                            });

                        });

                    }, 300);
                },

                open: function(id) {
                    $("#skillsText").attr("class", "");

                    this.blackhole.stop();
                    this.skillsGroupMask.stop();

                    if(this.navigationGroup) {
                        $(this.navigationGroup.node).remove();
                    }

                    var self = this,
                        lis = $("#"+id+" ul li"),
                        lisTmp = [], hoverTmp = [];

                    // Create text nodes & group text nodes
                    self.navigationGroup = self.canvas.main.group();
                    self.closeCircleGroup = self.canvas.main.group();
                    self.circles = [];
                    self.circles2 = [];

                    $.each(lis, function(ind, elm) {
                        var y = 440,
                            x = (ind * 30),
                            text = ""+(ind+1);

                        hoverTmp[ind] = self.canvas.main.circle(x, y, 12).attr({ fill: "transparent" });
                        lisTmp[ind] = self.canvas.main.text(x, y, text).attr({ fill: "#00a2ff" });
                        self.circles[ind] = self.canvas.main.circle(x, y, 0).attr({ fill: "#000" });
                        self.circles2[ind] = self.canvas.main.circle(x, y, 0).attr({ fill: "#FFF" });

                        self.navigationGroup.add(self.circles[ind], self.circles2[ind], lisTmp[ind], hoverTmp[ind]);
                    });



                    var x = (self.skillsTitle.getBBox().x + self.skillsTitle.getBBox().width) + 15,// + 25,
                        y = self.skillsTitle.getBBox().y + 5;// + 22;

                    self.closeCircles = self.canvas.main.circle(x, y, 0).attr({ fill: "#000" });
                    self.closeCircles2 = self.canvas.main.circle(x, y, 0).attr({ fill: "#FFF" });
                    self.closeText = self.canvas.main.text(x-5.3, y+6.2, "X").attr({ fill: "#F00", class: "close" });
                    self.closeCircle = self.canvas.main.circle(x, y, 12).attr({ fill: "transparent" });

                    self.closeCircleGroup.add( self.closeCircles, self.closeCircles2, self.closeText, self.closeCircle );

                    var clicked = false;
                    self.closeCircle.hover(function() {

                        self.closeCircles.animate({
                            r: 12
                        }, 400, mina.bounce);

                    }, function() {

                        if(clicked === false) {
                            self.closeCircles.animate({
                                r: 10
                            }, 400, mina.bounce);
                        }

                    });

                    self.closeCircle.click(function() {
                        clicked = true;

                        // self.events.skills.load.call(self, lis, ind);
                        self.events.overlay.close.call(self);

                        self.closeCircles.animate({
                            r: 0
                        }, 300);

                        self.closeCircles2.animate({
                            r: 0
                        }, 300);

                        self.closeCircle.animate({
                            r: 0
                        }, 300);
                    });

                    self.closeCircles.animate({
                        r: 10
                    }, 1200, mina.elastic);


                    // Position text centered
                    var width = self.navigationGroup.getBBox().width / 2;
                    $.each(lisTmp, function(ind, elm) {

                        elm.attr({
                            x: (((300 - width) + (ind * 30)) + 12) - (elm.getBBox().width / 2)
                        });

                        self.circles[ind].attr({
                            cx: ((300 - width) + (ind * 30)) + 12,
                            cy: self.circles[ind].getBBox().cy - 6
                        });

                        self.circles2[ind].attr({
                            cx: $(self.circles[ind].node).attr("cx"),
                            cy: $(self.circles[ind].node).attr("cy")
                        });

                        // Add invisible hover circle
                        hoverTmp[ind].attr({
                            cx: $(self.circles[ind].node).attr("cx"),
                            cy: $(self.circles[ind].node).attr("cy"),
                            r: 14
                        });

                        // Add animation
                        window.setTimeout(function(){

                            if(ind === 0) {
                                self.circles2[ind].animate({
                                    r: 12
                                }, 1500, mina.elastic);
                            }

                            self.circles[ind].animate({
                                r: 12
                            }, 1500, mina.elastic);

                        }, 100*(ind+1));

                        hoverTmp[ind].hover(function() {

                            self.circles[ind].animate({
                                r: 14
                            }, 400, mina.bounce);

                        }, function() {

                            self.circles[ind].animate({
                                r: 12
                            }, 400, mina.bounce);

                        });

                        hoverTmp[ind].click(function() {

                            self.events.skills.load.call(self, lis, ind);

                            for(var i = 0; i < self.circles2.length; i++) {

                                self.circles2[i].animate({
                                    r: (i === ind) ? 12 : 0
                                }, 400, mina.bounce);

                            }

                        });

                    });

                }
            },

            skills: {

                load: function(li, pos) {
                    var self = this,
                        data = {
                            position: pos,
                            elements: li,
                            element: li[pos],
                            image: $(li[pos]).data("image")
                        };

                    self.animations.experienceBar.call(self, $(data.element).data("experience"));

                    // var g = self.canvas.main.group().attr({ id: "cont" });
                    Snap.load(this.baseHref + data.image, function (img) {

                        self.skillsGroupMask.animate({
                            transform: "translate(500, 0)"
                        }, 500, null, function() {

                            if(self.windowActive) {

                                // get the workspace
                                var workspace = $(self.skillsGroup.node);// $("#skillsMain");

                                // use the jquery .empty() method to clean out all previous content if necessary (optional)
                                workspace.empty();

                                // to insert the svg into the dom, we need to insert only the svg-node of the Snap fragment
                                workspace.append(img.node);
                                var snapElement = new Snap("#skillsMain svg");

                                snapElement.attr({
                                    width: 120,
                                    y: 0,
                                    x: 300 - 60
                                });

                                var clone = self.skillsSubtitle.clone();

                                workspace.append(clone.node);
                                $(clone.node).html($(data.element).text());

                                clone.attr({
                                    class: 'subtitle'
                                }).attr({
                                    fill: "#FFF",
                                    x: 300-(clone.getBBox().width/2),
                                });

                                self.skillsGroupMask.animate({
                                    transform: "translate(-220, 0)"
                                }, 500);
                            }

                        });
                    });

                }

            },

            moon: {

                hover: function( id, moon, orbit, text, i ) {
                    $("#skillsText").attr("class", "hover");

                    for(var i = 0; i < 4; i++) {
                        this.animations[i].pause();
                    }

                    orbit.attr({
                        stroke: this.attributes.hover.fill,
                    });
                    moon.attr(this.attributes.hover);
                    text.attr(this.attributes.hover);

                },

                unhover: function( id, moon, orbit, text, i ) {
                    $("#skillsText").attr("class", "");

                    for(var i = 0; i < 4; i++) {
                        this.animations[i].resume();
                    }

                    orbit.attr({
                        stroke: this.attributes.unhover.fill,
                    });
                    moon.attr(this.attributes.unhover);
                    text.attr(this.attributes.planets.text);

                },

                click: function( id, moon, orbit, text, i ) {
                    var self = this;

                    $("#skillsOrbit").attr("class", "active");
                    $("#skillsMain").attr("class", "active");
                    $("#skillsText").attr("class", "");

                    self.windowActive = true;

                    self.blackhole.animate({
                        r: 20
                    }, 400, mina.easeinout,function() {

                        var width = $(window).width();

                        // Animate blackhole to small to big again
                        self.blackhole.animate({
                            r: 85
                        }, 2000, mina.elastic);

                        // Create text node and move it in
                        self.skillsTitle = self.canvas.main.text(-600, 180, $("#"+id+" h2").text());
                        self.skillsTitle.attr({
                            class: "title"
                        }).animate({
                            x: parseFloat(300-(self.skillsTitle.getBBox().width)/2)
                        }, 600, mina.bounce);

                        // Animate circle1 instant
                        self.overlay.circle1.animate({
                            r: width
                        }, 600, mina.easeout);

                        // Animate circle2 after 100 delay
                        window.setTimeout(function(){
                            self.overlay.circle2.animate({
                                r: width
                            }, 600, mina.easeout);
                        }, 100);

                        // Animate circle3 after 600 delay
                        window.setTimeout(function(){
                            self.overlay.circle3.animate({
                                r: width
                            }, 600, mina.easeout, function() {
                                self.events.overlay.open.call(self, id);
                                self.events.skills.load.call(self, $("#"+id+" ul li"), 0);
                            });
                        }, 200);

                    });

                }

            }

        }

    };

    $(document).ready(function() {
        skills.init();
    });

})(window.Snap, window.jQuery);
