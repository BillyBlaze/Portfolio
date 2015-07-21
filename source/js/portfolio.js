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

        modal: {

            content: null,
            inner: null,
            background: null,
            close: null,

            isOpen: false,

        },

        baseHref: $("base").attr("href"),
        navigationUsed: false,

        init: function() {
            var self = this;

            this.modal.content = $("#overlay");
            this.modal.inner = $("#inner-overlay");
            this.modal.background = $("#overlay-bg");
            this.modal.close = $("#close");

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

            $('.frame a svg').each(function(ind, elm) {

                self.canvas.overlay[ind] = Snap(elm);
                self.overlays[ind] = self.canvas.overlay[ind].attr({ viewBox: "0 0 702 413" });

                var text = self.canvas.overlay[ind].text("50%", 230, "More info").attr(self.attributes.textMask),
                    textWhite = self.canvas.overlay[ind].text("50%", 230, "More info").attr(self.attributes.rectFill),
                    fill = self.canvas.overlay[ind].rect(-50, -50, 702+100, 413+100).attr(self.attributes.rectFill),
                    loadFill = self.canvas.overlay[ind].rect(-50, -50, 702+100, 413+100).attr(self.attributes.rectFill),
                    bg = self.canvas.overlay[ind].rect(-50, -50, 702+100, 413+100).attr(self.attributes.overlayFill);

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
                text.attr({
                    x: 351 - (text.getBBox().width/2)
                });
                textWhite.attr({
                    x: 351 - (textWhite.getBBox().width/2)
                });
                loadText.attr({
                    x: 351 - (loadText.getBBox().width/2)
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

            // Bind to State Change
            History.Adapter.bind(window,'statechange',function(){
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

        tween: {},
        events: {

            preload: function( browserFrameUrl ) {
                var self = this,
                    elm = $("[href='" + browserFrameUrl + "']"),
                    loader = $("[href='" + browserFrameUrl + "'] svg .loadIndicator"),
                    $browserFrame = elm.closest(".browser.main");

                $browserFrame.addClass("active");
                elm.parents("[id]").addClass('active');

                self.modal.inner.html("");
                loader.text("Loading images");

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
                            title.appendTo(content).text(obj.title);

                            columnImage.addClass("image").appendTo(content);
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
