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
            this.scene.background.call(this);
            this.scene.portfolio.call(this);
            this.scene.about.call(this);
            this.scene.skills.call(this);
            this.scene.cv.call(this);
            this.scene.footer.call(this);

            // If not mobile, resize header onResize
            if( !('ontouchstart' in document.documentElement) ) {
                $(window).on('resize', this.events.resizeHeader).trigger('resize');
            }

            // Make scroll steps animated in webkit / IE browsers if mousewheel is used
            // if(
            //     (
            //         /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()) ||
            //         /trident/.test(navigator.userAgent.toLowerCase())
            //     ) &&
            //     !('ontouchstart' in document.documentElement)
            // ) {
            // }

            $(document).mousewheel(this.events.scroll.bind(this));
            $(document).on('scroll', this.events.scrollNonWheel.bind(this));

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

                    var hr = $("<hr/>").insertAfter("#contact");

                    self.scenes.footer = new ScrollMagic.Scene({triggerElement: hr[0], triggerHook: "onEnter", duration: 0, offset: -70})
                        .setClassToggle($elm, "active")
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

                this.isMouseWheel = true;

                // Disable smoothscrolling in overlay/modal
                if($('body').hasClass("noScroll")) {
                    return;
                }

                // Stop default scrolling
                e.preventDefault();

                var self = this,
                    scrollTop = self.options.scroll.chainScrollTop || target.window.scrollTop(),
                    finalScroll = scrollTop - parseInt(e.deltaY * 150);

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
                        autoKill: true
                    },
                    ease: Power1.easeOut,
                    autoKill: true,
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

            },

        }

    };

    scrolling.init();

})( window.TimelineMax, window.ScrollMagic, window.jQuery );
