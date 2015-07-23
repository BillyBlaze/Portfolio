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

(function(TimelineMax, ScrollMagic, $) {

    // var debug = true;
    var debug = false;
    var options = (debug === true) ? { addIndicators: true } : {};
    var scrolling = {
        controller: new ScrollMagic.Controller(options),

        options: {
            scroll: {
                timer: 0.5,
                distance: 250,
                scrollOffset: 0
            }
        },

        elements: {
            header: {
                title: $('header h1'),
                subtitle: $('header h2'),
                logo: $('header img#me'),
                boba: $('header img#helmet')
            },
            portfolio: {
                items: $('#portfolio ul li section'),
            },
            cv: $("#cv ol li section"),
        },

        isMouseWheel: false,

        init: function() {

            // Setup all scenes
            this.scene.intro.call(this);
            if( !('ontouchstart' in document.documentElement) ) {
                this.scene.background.call(this);
            }
            this.scene.portfolio.call(this);
            this.scene.about.call(this);
            this.scene.skills.call(this);
            this.scene.cv.call(this);
            this.scene.footer.call(this);

            // If not mobile, resize header onResize and add scroll
            if( !('ontouchstart' in document.documentElement) ) {
                $(window).on('resize', this.events.resizeHeader).trigger('resize');

                $(document).mousewheel(this.events.scroll.bind(this));
                $(document).on('scroll', this.events.scrollNonWheel.bind(this));
            }

            $(window).resize(function() {

                if(this.scenes.header !== undefined && this.scenes.header !== null) { //Skip check if intro is still playing
                    if($(window).width() < 700) {
                        this.scenes.header.enabled(false);

                        $('header span, header .logo').attr('style', '');
                    } else {
                        this.scenes.header.enabled(true);
                    }
                }

            }.bind(this));
        },

        tweens: {}, //placeholder for animations
        scenes: {}, //placeholder for scrollmagic

        scene: {

            intro: function() {

                // Set viewport to top
                $('html, body').animate({
                    scrollTop: 0
                }, 10);

                // Set current state as first page
                History.pushState({
                    state: 1,
                    rand: Math.random()
                }, $(document).title, window.location.href);

                // Tween introduction (name, function, illustration)
                this.tweens.intro = new TimelineMax({onComplete: this.scene.header.bind(this)})
                    .fromTo( this.elements.header.title, .4, {
                        x: -5000
                    }, {
                        delay: 0.8,
                        x: 0,
                        ease: Back.easeOut
                    })
                    .fromTo( this.elements.header.subtitle, .4, {
                        y: -100,
                        opacity: 0
                    },{
                        delay: 0.2,
                        y: 0,
                        opacity: 1,
                        ease: Expo.easeOut
                    })
                    .fromTo( this.elements.header.logo, .4, {
                        y: -200,
                        opacity: 0
                    },{
                        delay: 0.2,
                        y: 0,
                        opacity: 1,
                        ease: Expo.easeOut
                    });

            },

            header: function() {

                // Activate any direct links to projects
                var href = window.location.href;
                if(href.indexOf("project/") !== -1) {
                    $('[href="' + href.slice(href.indexOf("project/")) + '"]').click();
                }

                // Build TweenMax tweens
                this.tweens.header = new TimelineMax()
                    .add([
                        TweenMax.to("header .logo", 0.1, {top: "-500px", ease: Ease.easeOut}),
                        TweenMax.to("header h1 span", 0.1, {margin: "0 0", ease: Ease.easeOut}),
                        TweenMax.to("header h2 span:first-child", 0.1, {margin: "0 0", ease: Ease.easeOut}),
                        TweenMax.to("header h2 span:last-child", 0.1, {margin: "0 0", ease: Ease.easeOut})
                    ]);

                // Build ScrollMagic scene
                this.scenes.header = new ScrollMagic.Scene({triggerElement: "header h1", duration: 500, offset: 100})
                    .setTween(this.tweens.header)
                    .addTo(this.controller);

                // Build TweenMax tweens
                this.tweens.gimmick = new TimelineMax()
                    .fromTo( this.elements.header.boba, .4, {
                        css: {
                            y: -450,
                            opacity: 0
                        }
                    } ,{
                        delay: 1,
                        css: {
                            y: -52,
                            opacity: 1
                        }, ease: Expo.easeOut
                    });

            },

            earth: function() {

                this.tweens.earth = new TimelineMax().add([
                    TweenMax.fromTo("footer", 0.001, {y: 200}, {y: 0, ease: Linear.easeNone})
                ]);

                this.scenes.earth = new ScrollMagic.Scene({triggerElement: ".hr", triggerHook: "onEnter", duration: 200})
                    .setTween(this.tweens.earth)
                    .addTo(this.controller);
            },

            background: function() {

                this.tweens.background = new TimelineMax().add([
                    TweenMax.fromTo("body", 0.001, {backgroundPosition: "50% 0%"}, {backgroundPosition: "50% 100%", ease: Linear.easeNone}),
                    TweenMax.fromTo(".wrapper", 0.001, {backgroundPosition: "50% -500px"}, {backgroundPosition: "50% -1100px", ease: Linear.easeNone})
                ]);

                this.scenes.background = new ScrollMagic.Scene({triggerElement: "header h1", duration: 6700, offset: 150})
                    .setTween(this.tweens.background)
                    .addTo(this.controller);

            },

            portfolio: function() {
                var self = this;

                this.tweens.portfolio = [];
                this.scenes.portfolio = [];

                this.elements.portfolio.items.each(function(ind, elm) {
                    var id = "#" + $(elm).attr("id");

                    self.tweens.portfolio[ind] = new TimelineMax().add([
                        TweenMax.fromTo(id +" h1", 1, {y: -50}, {y: 500-(Math.random()*100), ease: Sine.easeInOut}),
                        TweenMax.fromTo(id +" .browser.small.left", 1, {y: (Math.random()*150)-250}, {y: 300-(Math.random()*100), ease: Linear.easeInOut}),
                        TweenMax.fromTo(id +" .browser.small.right", 1, {y: (Math.random()*150)-250}, {y: 300-(Math.random()*100), ease: Linear.easeInOut})
                    ]);

                    self.scenes.portfolio[ind] = new ScrollMagic.Scene({triggerElement: $(elm).parent()[0], duration: 1300, offset: -20})
                        .setTween(self.tweens.portfolio[ind])
                        .addTo(self.controller);

                });

            },

            about: function() {

                this.tweens.about = new TimelineMax().add([
                    TweenMax.fromTo("#about", 1, {y: -80}, {y: 60, ease: Linear.easeInOut})
                ]);

                this.scenes.about = new ScrollMagic.Scene({triggerElement: "#about", duration: 750, offset: -20})
                    .setTween(this.tweens.about)
                    .addTo(this.controller);

            },

            skills: function() {

                this.tweens.skills = new TimelineMax().add([
                    TweenMax.fromTo("#skillsMain", 1, {top: -100}, {top: 35, ease: Ease.easeOutIn}),
                    TweenMax.fromTo("#skillsOrbit", 1, {top: -100}, {top: 35, ease: Ease.easeOutIn}),
                    TweenMax.fromTo("#skillsMoons", 1, {top: -50}, {top: 40, ease: Ease.easeOutIn}),
                    TweenMax.fromTo("#skillsText", 1, {top: -100}, {top: 40, ease: Ease.easeOutIn})
                ]);

                this.scenes.skills = new ScrollMagic.Scene({triggerElement: "#skills", duration: 800})
                    .setTween(this.tweens.skills)
                    .addTo(this.controller);

            },

            cv: function() {
                var self = this;

                this.scenes.cv = [];

                this.elements.cv.each(function(ind, elm) {
                    $(elm).removeClass('active');

                    self.scenes.cv[ind] = new ScrollMagic.Scene({triggerElement: elm, triggerHook: "onEnter", duration: 0, offset: ($(elm).height()+40)})
                        .setClassToggle(elm, "active")
                        .addTo(self.controller);

                });

            },

            footer: function() {
                var self = this;

                $("#contact").on("cloudLoaded", function(e, $elm) {

                    var hr = $("<hr/>").insertAfter("#contact"),
                        tweens = [];

                    $("#cloud circle, #cloud ellipse").each(function(ind, elm) {
                        var width = $(elm).width() / 2,
                            duration = Math.floor(Math.random() * (4 - 2)) + 2;

                        $(elm).attr("transform-origin", [width, width]);
                        tweens.push(TweenMax.fromTo(elm, duration, {transform: "matrix(0, 0, 0, 0, 0, 170)"}, {transform: "matrix(1, 0, 0, 1, 0, 0)", ease: Ease.easeOutIn}))
                    });

                    self.tweens.clouds = new TimelineMax().add(tweens);

                    self.scenes.clouds = new ScrollMagic.Scene({triggerElement: hr[0], triggerHook: "onEnter", duration: 0, offset: -70})
                        .setTween(self.tweens.clouds)
                        .addTo(self.controller);

                });

                $("#contact").on("rocketLoaded", function(e, $elm, elm) {

                    self.tweens.footer = new TimelineMax().add([
                        TweenMax.fromTo($elm, 1, { top: 40, marginLeft: 0, transform: "scale(1.5) rotate(1deg)"}, { top: -200, marginLeft: 30, transform: "scale(1.7) rotate(9deg)", ease: Ease.easeOutIn})
                    ]);

                    self.scenes.footer = new ScrollMagic.Scene({triggerElement: "#contact", triggerHook: "onEnter", duration: 600, offset: -50})
                        .setTween(self.tweens.footer)
                        .addTo(self.controller);

                });

            }

        },

        events: {

            resizeHeader: function(e) {
                var size = $(window).height(),
                    header = $('header').height();

                $('header').css('margin', ((size - header) / 2) + "px auto");
            },

            scroll: function(e) {

                var target = {
                    window: $(window),
                    scroller: $(window),
                    document: $(document)
                };

                // Disable smoothscrolling in overlay/modal
                if($('body').hasClass("noScroll")) {
                    return;
                }

                // Stop default scrolling
                e.preventDefault();
                this.isMouseWheel = true;

                var self = this,
                    scrollTop = self.options.scroll.chainScrollTop || target.window.scrollTop(),
                    finalScroll = scrollTop - parseInt((e.deltaY < 0) ? -150 : 150);
                    // finalScroll = scrollTop - parseInt(e.deltaY * e.deltaFactor);

                // Save finalScroll to variable so we can chain multiple scroll wheels
                self.options.scroll.chainScrollTop = ( finalScroll <= 0 || finalScroll >= (target.document.height() - target.window.height()) ) ? self.options.scroll.chainScrollTop : finalScroll;

                if( finalScroll < 0 ) {
                    finalScroll = 0;
                }

                if( finalScroll > ( target.document.height() - target.window.height() ) ) {
                    finalScroll = target.document.height() - target.window.height();
                }

                TweenMax.to(target.window, 0.5, {
                    scrollTo: {
                        y: finalScroll,
                        autoKill: false
                    },
                    ease: ( typeof InstallTrigger !== 'undefined' ) ? Power2.easeOut : Power1.easeOut, //Firefox likes Power2, Chrome likes Power1
                    overwrite: 1,//Do not "preexist" animations, just kill it (with fire!)
                    onComplete: function() {
                        self.options.scroll.chainScrollTop = target.window.scrollTop(); // Set chainScrollTop with current scrollTop just to be safe
                        self.isMouseWheel = false;
                    }
                });

            },

            scrollNonWheel: function(e) {

                if( !this.isMouseWheel ) { //Block any scroll events made with a non mousewheel (keys, touch)
                    this.options.scroll.chainScrollTop = $(window).scrollTop(); // Set chainScrollTop with current scrollTop
                }

            }

        }

    };

    scrolling.init();

})( window.TimelineMax, window.ScrollMagic, window.jQuery );

(function(Snap, $, History) {

    var portfolio = {

        canvas: {
            overlay: []
        },

        overlays: [],

        attributes: {

            textMask: {
                fill: "#000"
            },
            rectFill: {
                fill: "#FFF"
            },
            overlayFill: {
                fill: "#000"
            }

        },

        baseHref: $("base").attr("href"),
        navigationUsed: false,

        init: function() {
            var self = this;

            //Setup modal
            this.modal.init.call(this);

            // Bind to Window State Change
            History.Adapter.bind(window, 'statechange', function(){
                var State = History.getState();

                if( self.navigationUsed !== true ) {
                    if(State.data.state === 2) {
                        self.events.preload.call(self, State.data.url)
                    } else {

                        // Only close modal if it's open
                        if(parseFloat(self.modal.content.css("left")) < 10) {
                            self.events.close.call(self, $(".browser.main.active"));
                        }
                    }
                }

                self.navigationUsed = false;

            });

        },

        modal: {

            content: null,
            inner: null,
            background: null,
            close: null,

            isOpen: false,

            init: function() {
                var self = this;

                // Grab elements from DOM
                this.modal.content = $("#overlay");
                this.modal.inner = $("#inner-overlay");
                this.modal.background = $("#overlay-bg");
                this.modal.close = $("#close");

                // Create DOM elements if non existing
                if(this.modal.content.length === 0) {
                    this.modal.content = $("<aside></aside>").attr("id", "overlay").appendTo("body > .wrapper");
                }
                if(this.modal.inner.length === 0) {
                    this.modal.inner = $("<div></div>").attr("id", "overlay-inner").appendTo(this.modal.content);
                }
                if(this.modal.background.length === 0) {
                    this.modal.background = $("<div></div>").attr("id", "overlay-bg").appendTo("body > .wrapper");
                }
                if(this.modal.close.length === 0) {
                    this.modal.close = $("<div></div>").attr("id", "close").text("X").insertBefore(this.modal.inner);
                }

                // Check if we need to realign the active frame
                $(window).on('resize', this.events.resize.bind(this));

                // Loop through all svg and add the overlay function
                $('.frame a svg').each(function(ind, elm) {

                    self.canvas.overlay[ind] = Snap(elm);
                    self.overlays[ind] = self.canvas.overlay[ind].attr({ viewBox: "0 0 702 413" });

                    var text = self.canvas.overlay[ind].text("50%", 230, "More info").attr(self.attributes.textMask),
                        textWhite = self.canvas.overlay[ind].text("50%", 230, "More info").attr(self.attributes.rectFill),
                        fill = self.canvas.overlay[ind].rect(-50, -50, 702+100, 413+100).attr(self.attributes.rectFill),
                        loadFill = self.canvas.overlay[ind].rect(-50, -50, 702+100, 413+100).attr(self.attributes.rectFill),
                        bg = self.canvas.overlay[ind].rect(-50, -50, 702+100, 413+100).attr(self.attributes.overlayFill);

                    // Center text
                    var centeredText = text.getBBox().width / 2;
                    text.attr({
                        x: 351 - centeredText
                    });
                    textWhite.attr({
                        x: 351 - centeredText
                    });

                    // Group cicles
                    var bgGroup = self.canvas.overlay[ind].group(fill, text),
                        loadGroup = self.canvas.overlay[ind].group(loadFill);

                    // Group mask
                    var bgMaskGroup = self.canvas.overlay[ind].group(bg),
                        loadMaskGroup = self.canvas.overlay[ind].group(textWhite),
                        loadText = self.canvas.overlay[ind].text("50%", 280, "Loading meta data...").attr({
                            fill: "#FFF",
                            class: "loadIndicator"
                        })

                    // Apply Masks
                    bgMaskGroup.attr({
                      mask: bgGroup
                    });
                    loadMaskGroup.attr({
                      mask: loadGroup
                    });

                    // Center text
                    loadText.attr({
                        x: 351 - (loadText.getBBox().width / 2)
                    });

                    var bbox = textWhite.getBBox();
                    loadFill.attr({
                        width: bbox.width,
                        height: bbox.height,
                        x: bbox.x,
                        y: bbox.y + bbox.height,

                        'data-height': bbox.height,
                        'data-y': bbox.y
                    })

                    $(elm).parent().click(function(e) {
                        e.preventDefault();

                        self.navigationUsed = true;
                        self.events.preload.call(self, $(elm).parent().attr("href"))
                    });

                });

            }
        },

        tween: {},
        events: {

            resize: function() {

                if( this.modal.isOpen ) {
                    var $browserFrame = $('.browser.main.active');

                    $('html, body').animate({
                        scrollTop: $browserFrame.offset().top - (($('#overlay section.row1').outerHeight() - $browserFrame.height()) / 2)
                    }, 100);

                }

            },

            preload: function( browserFrameUrl ) {
                var self = this,
                    elm = $("[href='" + browserFrameUrl + "']"),
                    loader = $("[href='" + browserFrameUrl + "'] svg .loadIndicator"),
                    $browserFrame = elm.closest(".browser.main");

                $browserFrame.addClass("active");
                elm.parents("[id]").addClass('active');

                self.modal.inner.html("");
                loader.text("Loading meta data");

                self.request = $.ajax(self.baseHref + browserFrameUrl.slice(0, -1) + ".json")
                    .done(function(response) {

                        var i = 1,
                            images = 0;

                        $(response.sections).each(function(ind, obj) {

                            var section = $("<section></section>"),
                                content = $("<div></div>"),
                                column = $("<div></div>"),
                                columnImage = $("<div></div>"),
                                title = $("<h1></h1>");

                            section.addClass("row" + (ind + 1) + " " + obj.class).appendTo(self.modal.inner);
                            content.addClass("content").appendTo(section);

                            if(obj.class != "one-column") {
                                title.appendTo(content).text(obj.title);
                            }

                            columnImage.addClass("image").appendTo(content);

                            if(obj.class == "one-column") {
                                title.appendTo(content).text(obj.title);
                            }

                            column.addClass("column").appendTo(content);

                            if(obj.image !== null && obj.image !== undefined) {
                                var image = $('<img/>');
                                // image[0].src = self.baseHref + obj.image;
                                image.attr("src", self.baseHref + obj.image).on('load', function() {

                                    if (i === images) {
                                        self.events.open.call(self, $(".browser.main.active"), $(elm).parents("[id]").children("h1").html(), elm.attr("href"));
                                        loader.text("Loading images ("+images+" of "+images+")");
                                    } else {
                                        i++;
                                        loader.text("Loading images ("+i+" of "+images+")");
                                    }

                                }).appendTo(columnImage);

                                images++;
                            }

                            if($.isArray(obj.content)) {
                                $.each(obj.content, function(ind, text) {
                                    $("<p></p>").appendTo(column).text(text);
                                });
                            } else {
                                $("<p></p>").appendTo(column).text(obj.content);
                            }

                        });

                        // Footer
                        var section = $("<footer></footer>"),
                            content = $("<div></div>"),
                            column = $("<div></div>"),
                            columnImage = $("<div></div>");

                        section.addClass("footer").appendTo(self.modal.inner);
                        content.addClass("content").appendTo(section);

                        column.addClass("column").appendTo(content);
                        columnImage.addClass("image").appendTo(content);

                        $('<h1></h1>').text("Skills used").appendTo(column);
                        $(response.summary.skills).each(function(ind, obj) {
                            $('<div></div>').addClass("tag").text(obj).appendTo(column);
                        });
                        $('<a></a>').attr("href", response.summary.website).addClass("btn").text("Learn more").appendTo(columnImage);

                        loader.text("Loading images (1 of "+images+")");
                        loader.attr({
                            x: 351 - (Snap.select("[href='" + browserFrameUrl + "'] svg .loadIndicator").getBBox().width/2)
                        });

                    })
                    .fail(function() {
                        console.log( "error" );
                    });

            },

            open: function( $browserFrame, title, url ) {
                var self = this;

                this.modal.isOpen = true;

                this.tween.browser = new TimelineMax()
                    .fromTo( $browserFrame, .5, {
                        left: 0
                    }, {
                        left: "-40%",
                        ease: Power1.easeOut
                    });

                this.tween.overlay = new TimelineMax()
                    .fromTo( $("#overlay"), .5, {
                        left: "100%"
                    },{
                        left: "0%",
                        ease: Power1.easeOut
                    });

                this.tween.overlayBG = new TimelineMax()
                    .fromTo( $("#overlay-bg"), .5, {
                        left: "100%"
                    },{
                        left: "0%",
                        ease: Power1.easeOut
                    });

                setTimeout(function() {

                    $("#overlay").addClass("open");
                    $('body').addClass("noScroll");
                    $('#close').addClass("active");

                    if( self.navigationUsed ) {
                        History.pushState({
                            state: 2,
                            url: url,
                            rand: Math.random()
                        }, title, self.baseHref + url);
                    }

                }, 500);

                $('html, body').animate({
                    scrollTop: $browserFrame.offset().top - (($('#overlay section.row1').outerHeight() - $browserFrame.height()) / 2)
                }, 500);

                $('.active .browser.main').parent().removeClass("active");
                $('body').addClass("noScrolling");

                $("#close").off('click').on('click', function() {

                    History.pushState({
                        state: 1,
                        rand: Math.random()
                    }, "", self.baseHref);

                }.bind(this));

            },

            close: function( $browserFrame ) {
                $("#overlay").removeClass("open");
                $('body').removeClass("noScrolling").removeClass("noScroll");

                this.modal.isOpen = false;

                this.tween.browser = new TimelineMax()
                    .fromTo( $browserFrame, .5, {
                        left: "-40%"
                    }, {
                        left: "0%",
                        ease: Power1.easeOut
                    });

                this.tween.overlay = new TimelineMax({
                        onComplete: function() {
                        }
                    })
                    .fromTo( $("#overlay"), .5, {
                        left: "0%"
                    },{
                        left: "100%",
                        ease: Power1.easeOut
                    });

                this.tween.overlayBG = new TimelineMax()
                    .fromTo( $("#overlay-bg"), .5, {
                        left: "0%"
                    },{
                        left: "100%",
                        ease: Power1.easeOut
                    });

                    setTimeout(function() {
                        $("#overlay").scrollTop(0);
                    }, 500);

                $('.active').removeClass("active");

            }

        }

    };

    portfolio.init();

})( window.Snap, window.jQuery, window.History );

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

                $(img.node).appendTo("#contact").attr("id", "cloud");

                var elm = Snap(img.node);
                $("#contact").trigger("cloudLoaded", [img.node, elm]);

            });

            Snap.load(this.baseHref + "img/rocket.svg", function (img) {

                $(img.node).appendTo("#contact").attr("id", "rocket");

                var elm = Snap(img.node);
                $("#contact").trigger("rocketLoaded", [img.node, elm]);

            });

        }

    };

    rocket.init();

})( window.Snap, window.jQuery );

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
                this.idList = Array("frontend", "backend", "libraries", "tools");

                // Create text node above a planet
                this.texts[0] = this.canvas.texts.text(this.canvas.middleX, this.canvas.middleY, "Front-end").attr(this.attributes.planets.text);
                this.texts[1] = this.canvas.texts.text(this.canvas.middleX, this.canvas.middleY, "Back-end").attr(this.attributes.planets.text);
                this.texts[2] = this.canvas.texts.text(this.canvas.middleX, this.canvas.middleY, "Libraries").attr(this.attributes.planets.text);
                this.texts[3] = this.canvas.texts.text(this.canvas.middleX, this.canvas.middleY, "Tools").attr(this.attributes.planets.text);

                // Create planets
                this.planets[0] = this.canvas.planets.circle(this.canvas.middleX, this.canvas.middleY, 2).attr(this.attributes.planets.objects);
                this.planets[1] = this.canvas.planets.circle(this.canvas.middleX, this.canvas.middleY, 2).attr(this.attributes.planets.objects);
                this.planets[2] = this.canvas.planets.circle(this.canvas.middleX, this.canvas.middleY, 2).attr(this.attributes.planets.objects);
                this.planets[3] = this.canvas.planets.circle(this.canvas.middleX, this.canvas.middleY, 2).attr(this.attributes.planets.objects);

                // Create orbits paths
                this.orbits[0] = this.canvas.planets.circlePath(this.canvas.middleX, this.canvas.middleY, 130, 1, 1).attr(this.attributes.planets.orbits);
                this.orbits[1] = this.canvas.planets.circlePath(this.canvas.middleX, this.canvas.middleY, 175, 2, 2).attr(this.attributes.planets.orbits);
                this.orbits[2] = this.canvas.planets.circlePath(this.canvas.middleX, this.canvas.middleY, 250, 3, 4).attr(this.attributes.planets.orbits);
                this.orbits[3] = this.canvas.planets.circlePath(this.canvas.middleX, this.canvas.middleY, 290, 4, 5).attr(this.attributes.planets.orbits);
                this.orbits[4] = this.canvas.planets.circlePath(this.canvas.middleX, this.canvas.middleY, 3000, 5, 200).attr(this.attributes.planets.orbits);

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
