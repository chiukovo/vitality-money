"use strict";
(function() {
setTimeout(function(){
    var userAgent = navigator.userAgent.toLowerCase(),
        initialDate = new Date(),
        $document = $(document),
        $window = $(window),
        $html = $("html"),
        $body = $("body"),
        isDesktop = $html.hasClass("desktop"),
        isRtl = $html.attr("dir") === "rtl",
        isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        windowReady = false,
        isNoviBuilder = false,
        plugins = {
            bootstrapTooltip: $("[data-toggle='tooltip']"),
            bootstrapModalDialog: $('.modal'),
            bootstrapTabs: $(".tabs-custom"),
            rdNavbar: $(".rd-navbar"),
            materialParallax: $(".parallax-container"),
            rdGoogleMaps: $(".rd-google-map"),
            rdMailForm: $(".rd-mailform"),
            rdInputLabel: $(".form-label"),
            regula: $("[data-constraints]"),
            wow: $(".wow"),
            owl: $(".owl-carousel"),
            search: $(".rd-search"),
            searchResults: $('.rd-search-results'),
            statefulButton: $('.btn-stateful'),
            popover: $('[data-toggle="popover"]'),
            viewAnimate: $('.view-animate'),
            radio: $("input[type='radio']"),
            checkbox: $("input[type='checkbox']"),
            customToggle: $("[data-custom-toggle]"),
            counter: $(".counter"),
            progressLinear: $(".progress-linear"),
            circleProgress: $(".progress-bar-circle"),
            dateCountdown: $('.DateCountdown'),
            preloader: $(".preloader"),
            captcha: $('.recaptcha'),
            lightGallery: $("[data-lightgallery='group']"),
            lightGalleryItem: $("[data-lightgallery='item']"),
            lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
            mailchimp: $('.mailchimp-mailform'),
            campaignMonitor: $('.campaign-mailform'),
            copyrightYear: $(".copyright-year"),
            bitcoinWidget: $("[class*='btcwdgt']"),
            slick: $('.slick-slider'),
            selectFilter: $(".select"),
            btcCalculator: $('.form-btc-calculator'),
            parallaxJs: $(".parallax-scene-js"),
            particles: $('#particles-js'),
            videoOverlay: $('.video-overlay'),
            scroller: $(".scroll-wrap"),
            canvasWorld: $('canvas#globe'),
            tiltHover: $('.js-tilt')
        };
    if (plugins.preloader.length && !isNoviBuilder) {
        pageTransition({
            page: $('.page'),
            animDelay: 0,
            animDuration: 500,
            animIn: 'fadeInUpSmall',
            animOut: 'fadeOutDownSmall',
            conditions: function(event, link) {
                return !/(\#|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery');
            },
            onAnimationStart: function(options) {
                setTimeout(function() {
                    plugins.preloader.removeClass('loaded');
                }, options.animDuration * .75);
            },
            onReady: function() {
                plugins.preloader.addClass('loaded');
                windowReady = true;
            }
        });
    }
    if (plugins.bitcoinWidget.length) {
        var bwAttributes = ['data-bw-theme', 'data-bw-entries', 'data-bw-cash', 'data-bw-cur'];
        for (var i = 0; i < bwAttributes.length; i++) {
            var item = bwAttributes[i],
                bwItem = $('[' + item + ']');
            bwItem.attr(item.replace('data-', ''), bwItem.attr(item));
            bwItem.removeAttr(item);
        }
    }
    $(function() {
        isNoviBuilder = window.xMode;

        function initOwlCarousel(c) {
            var aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
                values = [0, 576, 768, 992, 1200, 1600],
                responsive = {};
            for (var j = 0; j < values.length; j++) {
                responsive[values[j]] = {};
                for (var k = j; k >= -1; k--) {
                    if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
                        responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
                    }
                    if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
                        responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
                    }
                    if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
                        responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
                    }
                }
            }
            if (c.attr('data-dots-custom')) {
                c.on("initialized.owl.carousel", function(event) {
                    var carousel = $(event.currentTarget),
                        customPag = $(carousel.attr("data-dots-custom")),
                        active = 0;
                    if (carousel.attr('data-active')) {
                        active = parseInt(carousel.attr('data-active'), 10);
                    }
                    carousel.trigger('to.owl.carousel', [active, 300, true]);
                    customPag.find("[data-owl-item='" + active + "']").addClass("active");
                    customPag.find("[data-owl-item]").on('click', function(e) {
                        e.preventDefault();
                        carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
                    });
                    carousel.on("translate.owl.carousel", function(event) {
                        customPag.find(".active").removeClass("active");
                        customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
                    });
                });
            }
            c.owlCarousel({
                autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
                autoplayTimeout: c.attr("data-autoplay-timeout") ? c.attr("data-autoplay-timeout") : 1000,
                autoplayHoverPause: true,
                loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
                items: 1,
                rtl: isRtl,
                center: c.attr("data-center") === "true",
                dotsContainer: c.attr("data-pagination-class") || false,
                navContainer: c.attr("data-navigation-container") || false,
                mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
                nav: c.attr("data-nav") === "true",
                dots: c.attr("data-dots") === "true",
                dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
                animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
                animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
                responsive: responsive,
                navText: function() {
                    try {
                        return JSON.parse(c.attr("data-nav-text"));
                    } catch (e) {
                        return [];
                    }
                }(),
                navClass: function() {
                    try {
                        return JSON.parse(c.attr("data-nav-class"));
                    } catch (e) {
                        return ['owl-prev', 'owl-next'];
                    }
                }()
            });
        }

        function isScrolledIntoView(elem) {
            if (!isNoviBuilder) {
                return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
            } else {
                return true;
            }
        }

        function lazyInit(element, func) {
            $document.on('scroll', function() {
                if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
                    func.call();
                    element.addClass('lazy-loaded');
                }
            }).trigger("scroll");
        }

        function liveSearch(options) {
            $('#' + options.live).removeClass('cleared').html();
            options.current++;
            options.spin.addClass('loading');
            $.get(handler, {
                s: decodeURI(options.term),
                liveSearch: options.live,
                dataType: "html",
                liveCount: options.liveCount,
                filter: options.filter,
                template: options.template
            }, function(data) {
                options.processed++;
                var live = $('#' + options.live);
                if ((options.processed === options.current) && !live.hasClass('cleared')) {
                    live.find('> #search-results').removeClass('active');
                    live.html(data);
                    setTimeout(function() {
                        live.find('> #search-results').addClass('active');
                    }, 50);
                }
                options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
            })
        }

        function attachFormValidator(elements) {
            regula.custom({
                name: 'PhoneNumber',
                defaultMessage: 'Invalid phone number format',
                validator: function() {
                    return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test(this.value);
                }
            });
            for (var i = 0; i < elements.length; i++) {
                var o = $(elements[i]),
                    v;
                o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
                v = o.parent().find(".form-validation");
                if (v.is(":last-child")) {
                    o.addClass("form-control-last-child");
                }
            }
            elements.on('input change propertychange blur', function(e) {
                var $this = $(this),
                    results;
                if (e.type !== "blur") {
                    if (!$this.parent().hasClass("has-error")) {
                        return;
                    }
                }
                if ($this.parents('.rd-mailform').hasClass('success')) {
                    return;
                }
                if ((results = $this.regula('validate')).length) {
                    for (i = 0; i < results.length; i++) {
                        $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
                    }
                } else {
                    $this.siblings(".form-validation").text("").parent().removeClass("has-error")
                }
            }).regula('bind');
            var regularConstraintsMessages = [{
                type: regula.Constraint.Required,
                newMessage: "The text field is required."
            }, {
                type: regula.Constraint.Email,
                newMessage: "The email is not a valid email."
            }, {
                type: regula.Constraint.Numeric,
                newMessage: "Only numbers are required"
            }, {
                type: regula.Constraint.Selected,
                newMessage: "Please choose an option."
            }];
            for (var i = 0; i < regularConstraintsMessages.length; i++) {
                var regularConstraint = regularConstraintsMessages[i];
                regula.override({
                    constraintType: regularConstraint.type,
                    defaultMessage: regularConstraint.newMessage
                });
            }
        }

        function isValidated(elements, captcha) {
            var results, errors = 0;
            if (elements.length) {
                for (var j = 0; j < elements.length; j++) {
                    var $input = $(elements[j]);
                    if ((results = $input.regula('validate')).length) {
                        for (k = 0; k < results.length; k++) {
                            errors++;
                            $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
                        }
                    } else {
                        $input.siblings(".form-validation").text("").parent().removeClass("has-error")
                    }
                }
                if (captcha) {
                    if (captcha.length) {
                        return validateReCaptcha(captcha) && errors === 0
                    }
                }
                return errors === 0;
            }
            return true;
        }

        function validateReCaptcha(captcha) {
            var captchaToken = captcha.find('.g-recaptcha-response').val();
            if (captchaToken.length === 0) {
                captcha.siblings('.form-validation').html('Please, prove that you are not robot.').addClass('active');
                captcha.closest('.form-wrap').addClass('has-error');
                captcha.on('propertychange', function() {
                    var $this = $(this),
                        captchaToken = $this.find('.g-recaptcha-response').val();
                    if (captchaToken.length > 0) {
                        $this.closest('.form-wrap').removeClass('has-error');
                        $this.siblings('.form-validation').removeClass('active').html('');
                        $this.off('propertychange');
                    }
                });
                return false;
            }
            return true;
        }
        window.onloadCaptchaCallback = function() {
            for (var i = 0; i < plugins.captcha.length; i++) {
                var $capthcaItem = $(plugins.captcha[i]);
                grecaptcha.render($capthcaItem.attr('id'), {
                    sitekey: $capthcaItem.attr('data-sitekey'),
                    size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
                    theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
                    callback: function(e) {
                        $('.recaptcha').trigger('propertychange');
                    }
                });
                $capthcaItem.after("<span class='form-validation'></span>");
            }
        };

        function initBootstrapTooltip(tooltipPlacement) {
            plugins.bootstrapTooltip.tooltip('dispose');
            if (window.innerWidth < 576) {
                plugins.bootstrapTooltip.tooltip({
                    placement: 'bottom'
                });
            } else {
                plugins.bootstrapTooltip.tooltip({
                    placement: tooltipPlacement
                });
            }
        }

        function initLightGallery(itemsToInit, addClass) {
            var $itemsToInit = $(itemsToInit);
            console.log($itemsToInit.attr("data-lg-autoplay"));
            if (!isNoviBuilder) {
                $itemsToInit.lightGallery({
                    thumbnail: $itemsToInit.attr("data-lg-thumbnail") !== "false",
                    selector: "[data-lightgallery='item']",
                    autoplay: $itemsToInit.attr("data-lg-autoplay") === "true",
                    pause: parseInt($itemsToInit.attr("data-lg-autoplay-delay")) || 5000,
                    addClass: addClass,
                    download: false,
                    mode: $itemsToInit.attr("data-lg-animation") || "lg-slide",
                    loop: $itemsToInit.attr("data-lg-loop") !== "false"
                });
            }
        }

        function initDynamicLightGallery(itemsToInit, addClass) {
            var $itemsToInit = $(itemsToInit);
            if (!isNoviBuilder) {
                $itemsToInit.on("click", function() {
                    $itemsToInit.lightGallery({
                        thumbnail: $itemsToInit.attr("data-lg-thumbnail") !== "false",
                        selector: "[data-lightgallery='item']",
                        autoplay: $itemsToInit.attr("data-lg-autoplay") === "true",
                        pause: parseInt($itemsToInit.attr("data-lg-autoplay-delay")) || 5000,
                        addClass: addClass,
                        mode: $itemsToInit.attr("data-lg-animation") || "lg-slide",
                        loop: $itemsToInit.attr("data-lg-loop") !== "false",
                        dynamic: true,
                        dynamicEl: JSON.parse($itemsToInit.attr("data-lg-dynamic-elements")) || []
                    });
                });
            }
        }

        function initLightGalleryItem(itemToInit, addClass) {
            var $itemToInit = $(itemToInit);
            if (!isNoviBuilder) {
                $itemToInit.lightGallery({
                    selector: "this",
                    addClass: addClass,
                    counter: false,
                    fullscreen: $itemToInit.attr("data-lg-fullscreen") !== "false",
                    youtubePlayerParams: {
                        modestbranding: 1,
                        showinfo: 0,
                        rel: 0,
                        controls: 1
                    },
                    vimeoPlayerParams: {
                        byline: 0,
                        portrait: 0
                    }
                });
            }
        }
        if (navigator.platform.match(/(Mac)/i)) {
            $html.addClass("mac-os");
        }
        if (isIE) {
            if (isIE < 10) {
                $html.addClass("lt-ie-10");
            }
            if (isIE === 11) {
                $html.addClass("ie-11");
            }
            if (isIE === 12) {
                $html.addClass("ie-edge");
            }
        }
        if (plugins.bootstrapTooltip.length) {
            var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
            initBootstrapTooltip(tooltipPlacement);
            $window.on('resize orientationchange', function() {
                initBootstrapTooltip(tooltipPlacement);
            })
        }
        if (plugins.bootstrapModalDialog.length) {
            for (var i = 0; i < plugins.bootstrapModalDialog.length; i++) {
                var modalItem = $(plugins.bootstrapModalDialog[i]);
                modalItem.on('hidden.bs.modal', $.proxy(function() {
                    var activeModal = $(this),
                        rdVideoInside = activeModal.find('video'),
                        youTubeVideoInside = activeModal.find('iframe');
                    if (rdVideoInside.length) {
                        rdVideoInside[0].pause();
                    }
                    if (youTubeVideoInside.length) {
                        var videoUrl = youTubeVideoInside.attr('src');
                        youTubeVideoInside.attr('src', '').attr('src', videoUrl);
                    }
                }, modalItem))
            }
        }
        if (plugins.popover.length) {
            if (window.innerWidth < 767) {
                plugins.popover.attr('data-placement', 'bottom');
                plugins.popover.popover();
            } else {
                plugins.popover.popover();
            }
        }
        if (plugins.statefulButton.length) {
            $(plugins.statefulButton).on('click', function() {
                var statefulButtonLoading = $(this).button('loading');
                setTimeout(function() {
                    statefulButtonLoading.button('reset')
                }, 2000);
            })
        }
        if (plugins.bootstrapTabs.length) {
            for (var i = 0; i < plugins.bootstrapTabs.length; i++) {
                var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);
                if (bootstrapTabsItem.find('.slick-slider').length) {
                    bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function() {
                        var $this = $(this);
                        var setTimeOutTime = isNoviBuilder ? 1500 : 300;
                        setTimeout(function() {
                            $this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
                        }, setTimeOutTime);
                    }, bootstrapTabsItem));
                }
            }
        }
        if (plugins.copyrightYear.length) {
            plugins.copyrightYear.text(initialDate.getFullYear());
        }
        if (plugins.radio.length) {
            for (var i = 0; i < plugins.radio.length; i++) {
                $(plugins.radio[i]).addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
            }
        }
        if (plugins.checkbox.length) {
            for (var i = 0; i < plugins.checkbox.length; i++) {
                $(plugins.checkbox[i]).addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
            }
        }
        if (isDesktop && !isNoviBuilder) {
            $().UItoTop({
                easingType: 'easeOutQuad',
                containerClass: 'ui-to-top fa fa-angle-up'
            });
        }
        if (plugins.rdNavbar.length) {
            var aliaces, i, j, len, value, values, responsiveNavbar;
            aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
            values = [0, 576, 768, 992, 1200, 1600];
            responsiveNavbar = {};
            for (i = j = 0, len = values.length; j < len; i = ++j) {
                value = values[i];
                if (!responsiveNavbar[values[i]]) {
                    responsiveNavbar[values[i]] = {};
                }
                if (plugins.rdNavbar.attr('data' + aliaces[i] + 'layout')) {
                    responsiveNavbar[values[i]].layout = plugins.rdNavbar.attr('data' + aliaces[i] + 'layout');
                }
                if (plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
                    responsiveNavbar[values[i]]['deviceLayout'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout');
                }
                if (plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
                    responsiveNavbar[values[i]]['focusOnHover'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
                }
                if (plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
                    responsiveNavbar[values[i]]['autoHeight'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
                }
                if (isNoviBuilder) {
                    responsiveNavbar[values[i]]['stickUp'] = false;
                } else if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
                    responsiveNavbar[values[i]]['stickUp'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true';
                }
                if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
                    responsiveNavbar[values[i]]['stickUpOffset'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
                }
            }
            plugins.rdNavbar.RDNavbar({
                anchorNav: !isNoviBuilder,
                stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
                responsive: responsiveNavbar,
                callbacks: {
                    onStuck: function() {
                        var navbarSearch = this.$element.find('.rd-search input');
                        if (navbarSearch) {
                            navbarSearch.val('').trigger('propertychange');
                        }
                    },
                    onDropdownOver: function() {
                        return !isNoviBuilder;
                    },
                    onUnstuck: function() {
                        if (this.$clone === null)
                            return;
                        var navbarSearch = this.$clone.find('.rd-search input');
                        if (navbarSearch) {
                            navbarSearch.val('').trigger('propertychange');
                            navbarSearch.trigger('blur');
                        }
                    }
                }
            });
            if (plugins.rdNavbar.attr("data-body-class")) {
                document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
            }
        }
        if (plugins.search.length || plugins.searchResults) {
            var handler = "bat/rd-search.php";
            var defaultTemplate = '<h5 class="search-title"><a target="_top" href="#{href}" class="search-link">#{title}</a></h5>' +
                '<p>...#{token}...</p>' +
                '<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
            var defaultFilter = '*.html';
            if (plugins.search.length) {
                for (var i = 0; i < plugins.search.length; i++) {
                    var searchItem = $(plugins.search[i]),
                        options = {
                            element: searchItem,
                            filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
                            template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
                            live: (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
                            liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live'), 10) : 4,
                            current: 0,
                            processed: 0,
                            timer: {}
                        };
                    var $toggle = $('.rd-navbar-search-toggle');
                    if ($toggle.length) {
                        $toggle.on('click', (function(searchItem) {
                            return function() {
                                if (!($(this).hasClass('active'))) {
                                    searchItem.find('input').val('').trigger('propertychange');
                                }
                            }
                        })(searchItem));
                    }
                    if (options.live) {
                        var clearHandler = false;
                        searchItem.find('input').on("input propertychange", $.proxy(function() {
                            this.term = this.element.find('input').val().trim();
                            this.spin = this.element.find('.input-group-addon');
                            clearTimeout(this.timer);
                            if (this.term.length > 2) {
                                this.timer = setTimeout(liveSearch(this), 200);
                                if (clearHandler === false) {
                                    clearHandler = true;
                                    $body.on("click", function(e) {
                                        if ($(e.toElement).parents('.rd-search').length === 0) {
                                            $('#rd-search-results-live').addClass('cleared').html('');
                                        }
                                    })
                                }
                            } else if (this.term.length === 0) {
                                $('#' + this.live).addClass('cleared').html('');
                            }
                        }, options, this));
                    }
                    searchItem.submit($.proxy(function() {
                        $('<input />').attr('type', 'hidden').attr('name', "filter").attr('value', this.filter).appendTo(this.element);
                        return true;
                    }, options, this))
                }
            }
            if (plugins.searchResults.length) {
                var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
                var match = regExp.exec(location.search);
                if (match !== null) {
                    $.get(handler, {
                        s: decodeURI(match[1]),
                        dataType: "html",
                        filter: match[2],
                        template: defaultTemplate,
                        live: ''
                    }, function(data) {
                        plugins.searchResults.html(data);
                    })
                }
            }
        }
        if (plugins.viewAnimate.length) {
            for (var i = 0; i < plugins.viewAnimate.length; i++) {
                var $view = $(plugins.viewAnimate[i]).not('.active');
                $document.on("scroll", $.proxy(function() {
                    if (isScrolledIntoView(this)) {
                        this.addClass("active");
                    }
                }, $view)).trigger("scroll");
            }
        }
        if (plugins.owl.length) {
            for (var i = 0; i < plugins.owl.length; i++) {
                var c = $(plugins.owl[i]);
                plugins.owl[i].owl = c;
                initOwlCarousel(c);
            }
        }
        if ($html.hasClass("wow-animation") && plugins.wow.length && !isNoviBuilder && isDesktop) {
            new WOW().init();
        }
        if (plugins.rdInputLabel.length) {
            plugins.rdInputLabel.RDInputLabel();
        }
        if (plugins.regula.length) {
            attachFormValidator(plugins.regula);
        }
        if (plugins.lightGallery.length) {
            for (var i = 0; i < plugins.lightGallery.length; i++) {
                initLightGallery(plugins.lightGallery[i]);
            }
        }
        if (plugins.lightGalleryItem.length) {
            var notCarouselItems = [];
            for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
                if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length && !$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length && !$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
                    notCarouselItems.push(plugins.lightGalleryItem[z]);
                }
            }
            plugins.lightGalleryItem = notCarouselItems;
            for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
                initLightGalleryItem(plugins.lightGalleryItem[i]);
            }
        }
        if (plugins.lightDynamicGalleryItem.length) {
            for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
                initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
            }
        }
        if (plugins.customToggle.length) {
            for (var i = 0; i < plugins.customToggle.length; i++) {
                var $this = $(plugins.customToggle[i]);
                $this.on('click', $.proxy(function(event) {
                    event.preventDefault();
                    var $ctx = $(this);
                    $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
                }, $this));
                if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
                    $body.on("click", $this, function(e) {
                        if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length && e.data.find($(e.target)).length === 0) {
                            $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
                        }
                    })
                }
                if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
                    $body.on("click", $this, function(e) {
                        if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length === 0 && e.data.find($(e.target)).length === 0) {
                            $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
                        }
                    })
                }
            }
        }
        if (plugins.counter.length) {
            for (var i = 0; i < plugins.counter.length; i++) {
                var $counterNotAnimated = $(plugins.counter[i]).not('.animated');
                $document.on("scroll", $.proxy(function() {
                    var $this = this;
                    if ((!$this.hasClass("animated")) && (isScrolledIntoView($this))) {
                        $this.countTo({
                            refreshInterval: 40,
                            from: 0,
                            to: parseInt($this.text(), 10),
                            speed: $this.attr("data-speed") || 1000
                        });
                        $this.addClass('animated');
                    }
                }, $counterNotAnimated)).trigger("scroll");
            }
        }
        if (plugins.circleProgress.length) {
            for (var i = 0; i < plugins.circleProgress.length; i++) {
                var circleProgressItem = $(plugins.circleProgress[i]);
                $document.on("scroll", $.proxy(function() {
                    var $this = $(this);
                    if (!$this.hasClass('animated') && isScrolledIntoView($this)) {
                        var arrayGradients = $this.attr('data-gradient').split(",");
                        $this.circleProgress({
                            value: $this.attr('data-value'),
                            size: $this.attr('data-size') ? $this.attr('data-size') : 175,
                            fill: {
                                gradient: arrayGradients,
                                gradientAngle: Math.PI / 4
                            },
                            startAngle: -Math.PI / 4 * 2,
                            emptyFill: $this.attr('data-empty-fill') ? $this.attr('data-empty-fill') : "rgb(245,245,245)",
                            thickness: $this.attr('data-thickness') ? parseInt($this.attr('data-thickness'), 10) : 10
                        }).on('circle-animation-progress', function(event, progress, stepValue) {
                            $(this).find('span').text(String(stepValue.toFixed(2)).replace('0.', '').replace('1.', '1'));
                        });
                        $this.addClass('animated');
                    }
                }, circleProgressItem)).trigger("scroll");
            }
        }
        if (plugins.progressLinear.length) {
            for (i = 0; i < plugins.progressLinear.length; i++) {
                var progressBar = $(plugins.progressLinear[i]);
                $window.on("scroll load", $.proxy(function() {
                    var bar = $(this);
                    if (!bar.hasClass('animated-first') && isScrolledIntoView(bar)) {
                        var end = parseInt($(this).find('.progress-value').text(), 10);
                        bar.find('.progress-bar-linear').css({
                            width: end + '%'
                        });
                        bar.find('.progress-value').countTo({
                            refreshInterval: 40,
                            from: 0,
                            to: end,
                            speed: 500
                        });
                        bar.addClass('animated-first');
                    }
                }, progressBar));
            }
        }
        if (plugins.materialParallax.length) {
            if (!isNoviBuilder && !isIE && !isMobile) {
                plugins.materialParallax.parallax();
            } else {
                for (var i = 0; i < plugins.materialParallax.length; i++) {
                    var parallax = $(plugins.materialParallax[i]),
                        imgPath = parallax.data("parallax-img");
                    parallax.css({
                        "background-image": 'url(' + imgPath + ')',
                        "background-attachment": "fixed",
                        "background-size": "cover"
                    });
                }
            }
        }
    });
    if (plugins.slick.length) {
        for (var i = 0; i < plugins.slick.length; i++) {
            var $slickItem = $(plugins.slick[i]);
            $slickItem.slick({
                slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll'), 10) || 1,
                asNavFor: $slickItem.attr('data-for') || false,
                dots: $slickItem.attr("data-dots") === "true",
                infinite: isNoviBuilder ? false : $slickItem.attr("data-loop") === "true",
                focusOnSelect: true,
                fade: $slickItem.attr("data-fade") === "true",
                arrows: $slickItem.attr("data-arrows") === "true",
                swipe: $slickItem.attr("data-swipe") === "true",
                autoplay: $slickItem.attr("data-autoplay") === "true",
                autoplaySpeed: 5000,
                vertical: $slickItem.attr("data-vertical") === "true",
                centerMode: $slickItem.attr("data-center-mode") === "true",
                centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
                mobileFirst: true,
                speed: 500,
                rtl: isRtl,
                responsive: [{
                    breakpoint: 0,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-items'), 10) || 1
                    }
                }, {
                    breakpoint: 575,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-sm-items'), 10) || 1
                    }
                }, {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-md-items'), 10) || 1
                    }
                }, {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-lg-items'), 10) || 1
                    }
                }, {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: parseInt($slickItem.attr('data-xl-items'), 10) || 1
                    }
                }]
            }).on('afterChange', function(event, slick, currentSlide, nextSlide) {
                var $this = $(this),
                    childCarousel = $this.attr('data-child');
                if (childCarousel) {
                    $(childCarousel + ' .slick-slide').removeClass('slick-current');
                    $(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
                }
            });
        }
    }
    if (plugins.selectFilter.length) {
        for (var i = 0; i < plugins.selectFilter.length; i++) {
            var select = $(plugins.selectFilter[i]);
            select.select2({
                placeholder: select.attr("data-placeholder") ? select.attr("data-placeholder") : false,
                minimumResultsForSearch: select.attr("data-minimum-results-search") ? select.attr("data-minimum-results-search") : 10,
                maximumSelectionSize: 3,
                dropdownCssClass: select.attr("data-dropdown-class") ? select.attr("data-dropdown-class") : ''
            });
        }
    }

    function toCurrencyFormat(stringValue) {
        var value = parseFloat(stringValue.replace(/[^\d.]/g, '')).toFixed(2);
        return $.isNumeric(value) ? value : 0;
    }

    function toCryptoCurrencyFormat(stringValue) {
        var value = parseFloat(stringValue.replace(/[^\d.]/g, '')).toFixed(8);
        return $.isNumeric(value) ? value : 0;
    }
    if (plugins.parallaxJs.length) {
        for (var i = 0; i < plugins.parallaxJs.length; i++) {
            var scene = plugins.parallaxJs[i];
            new Parallax(scene);
        }
    }
    if (plugins.particles.length) {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 230,
                    "density": {
                        "enable": true,
                        "value_area": 5000
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "src": "img/github.svg",
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 5,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 10,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 3,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }
    if (plugins.videoOverlay.length) {
        for (var i = 0; i < plugins.videoOverlay.length; i++) {
            var overlay = $(plugins.videoOverlay[i]);
            if (overlay) {
                overlay.css({
                    'opacity': '1'
                });
                overlay.on('click', function() {
                    $(this).animate({
                        opacity: 0
                    }, function() {
                        this.style.display = 'none';
                    });
                });
            }
        }
    }
    if (plugins.scroller.length) {
        var i;
        for (i = 0; i < plugins.scroller.length; i++) {
            var scrollerItem = $(plugins.scroller[i]);
            scrollerItem.jScrollPane();
        }
    }
    if ($('[data-parallax-scroll]').length && !isNoviBuilder && !isMobile) {
        ParallaxScroll.init();
    }
    if (plugins.tiltHover.length) {
        plugins.tiltHover.tilt({
            maxTilt: 5,
            glare: true,
            maxGlare: .5
        })
    }
}, 200)
}())

if (/iPhone|iPad/i.test(navigator.userAgent)) {
    $('.nav-link').on('touchend', function(e) {
        $(this).trigger('click');
    });
}