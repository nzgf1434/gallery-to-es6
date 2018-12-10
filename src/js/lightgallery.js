/** Polyfill the CustomEvent() constructor functionality in Internet Explorer 9 and higher */
import customEvent from './modules/polyfilCustomEvent';
if(typeof window.CustomEvent !=='function'){
    customEvent.prototype = window.Event.prototype;
    window.CustomEvent = customEvent;
};

import utils from './lg-utils';
window.utils = utils;
window.lgData = {
    uid: 0
};

window.lgModules = {};

import defaultSettings from './modules/defaultSettings';
var defaults = defaultSettings;

function Plugin(element, options) {   // Основная ф-ия для работы со слайдером

    // Current lightGallery element
    this.el = element;

    // lightGallery settings
    this.s = Object.assign({}, defaults, options);

    // When using dynamic mode, ensure dynamicEl is an array
    if (this.s.dynamic && this.s.dynamicEl !== 'undefined' && this.s.dynamicEl.constructor === Array && !this.s.dynamicEl.length) {
        throw ('When using dynamic mode, you must also define dynamicEl as an Array.');
    }

    // lightGallery modules
    this.modules = {};

    // false when lightgallery complete first slide;
    this.lGalleryOn = false;

    this.lgBusy = false;

    // Timeout function for hiding controls;
    this.hideBartimeout = false;

    // To determine browser supports for touch events;
    this.isTouch = ('ontouchstart' in document.documentElement);

    // Disable hideControlOnEnd if sildeEndAnimation is true
    if (this.s.slideEndAnimatoin) {
        this.s.hideControlOnEnd = false;
    }

    this.items = [];

    // Gallery items
    if (this.s.dynamic) {
        this.items = this.s.dynamicEl;
    } else {
        if (this.s.selector === 'this') {
            this.items.push(this.el);
        } else if (this.s.selector !== '') {
            if (this.s.selectWithin) {
                this.items = document.querySelector(this.s.selectWithin).querySelectorAll(this.s.selector);
            } else {
                this.items = this.el.querySelectorAll(this.s.selector);
            }
        } else {
            this.items = this.el.children;
        }
    }

    // .lg-item

    this.___slide = '';

    // .lg-outer
    this.outer = '';

    this.init();

    return this;
};

import initModul from './modules/init';
Plugin.prototype.init = initModul;

import buildModul from './modules/build';
Plugin.prototype.build = buildModul;

import structureModul from './modules/structure';
Plugin.prototype.structure = structureModul;

// For fixed height gallery
import setTopModul from './modules/setTop';
Plugin.prototype.setTop = setTopModul;

// Find css3 support
import doCssModul from './modules/doCss';
Plugin.prototype.doCss = doCssModul;


import isVideoModul from './modules/isVideo';
Plugin.prototype.isVideo = isVideoModul;

import counterModul from './modules/counter';
Plugin.prototype.counter = counterModul;


import addHtmlModul from './modules/addHtml';
Plugin.prototype.addHtml = addHtmlModul;


import preloadModul from './modules/preload';
Plugin.prototype.preload = preloadModul;


import loadContentModul from './modules/loadContent';
Plugin.prototype.loadContent = loadContentModul;


import slideModul from './modules/slide';
Plugin.prototype.slide = slideModul;


import nextSlideModul from './modules/nextSlide';
Plugin.prototype.goToNextSlide = nextSlideModul;

import previousSlideModul from './modules/prevSlide';
Plugin.prototype.goToPrevSlide = previousSlideModul;

import keyPressModul from './modules/keyPress';
Plugin.prototype.keyPress = keyPressModul;

import arrowModul from './modules/arrow';
Plugin.prototype.arrow = arrowModul;

import arrowDisableModul from './modules/arrowDisable';
Plugin.prototype.arrowDisable = arrowDisableModul;

import setTranslateModul from './modules/setTranslate';
Plugin.prototype.setTranslate = setTranslateModul;

Plugin.prototype.touchMove = function(startCoords, endCoords) {

    var distance = endCoords - startCoords;

    if (Math.abs(distance) > 15) {
        // reset opacity and transition duration
        utils.addClass(this.outer, 'lg-dragging');

        // move current slide
        this.setTranslate(this.___slide[this.index], distance, 0);

        // move next and prev slide with current slide
        this.setTranslate(document.querySelector('.lg-prev-slide'), -this.___slide[this.index].clientWidth + distance, 0);
        this.setTranslate(document.querySelector('.lg-next-slide'), this.___slide[this.index].clientWidth + distance, 0);
    }
};

Plugin.prototype.touchEnd = function(distance) {
    var _this = this;

    // keep slide animation for any mode while dragg/swipe
    if (_this.s.mode !== 'lg-slide') {
        utils.addClass(_this.outer, 'lg-slide');
    }

    for (var i = 0; i < this.___slide.length; i++) {
        if (!utils.hasClass(this.___slide[i], 'lg-current') && !utils.hasClass(this.___slide[i], 'lg-prev-slide') && !utils.hasClass(this.___slide[i], 'lg-next-slide')) {
            this.___slide[i].style.opacity = '0';
        }
    }

    // set transition duration
    setTimeout(function() {
        utils.removeClass(_this.outer, 'lg-dragging');
        if ((distance < 0) && (Math.abs(distance) > _this.s.swipeThreshold)) {
            _this.goToNextSlide(true);
        } else if ((distance > 0) && (Math.abs(distance) > _this.s.swipeThreshold)) {
            _this.goToPrevSlide(true);
        } else if (Math.abs(distance) < 5) {

            // Trigger click if distance is less than 5 pix
            utils.trigger(_this.el, 'onSlideClick');
        }

        for (var i = 0; i < _this.___slide.length; i++) {
            _this.___slide[i].removeAttribute('style');
        }
    });

    // remove slide class once drag/swipe is completed if mode is not slide
    setTimeout(function() {
        if (!utils.hasClass(_this.outer, 'lg-dragging') && _this.s.mode !== 'lg-slide') {
            utils.removeClass(_this.outer, 'lg-slide');
        }
    }, _this.s.speed + 100);

};

Plugin.prototype.enableSwipe = function() {
    var _this = this;
    var startCoords = 0;
    var endCoords = 0;
    var isMoved = false;

    if (_this.s.enableSwipe && _this.isTouch && _this.doCss()) {

        for (var i = 0; i < _this.___slide.length; i++) {
            /*jshint loopfunc: true */
            utils.on(_this.___slide[i], 'touchstart.lg', function(e) {
                if (!utils.hasClass(_this.outer, 'lg-zoomed') && !_this.lgBusy) {
                    e.preventDefault();
                    _this.manageSwipeClass();
                    startCoords = e.targetTouches[0].pageX;
                }
            });
        }

        for (var j = 0; j < _this.___slide.length; j++) {
            /*jshint loopfunc: true */
            utils.on(_this.___slide[j], 'touchmove.lg', function(e) {
                if (!utils.hasClass(_this.outer, 'lg-zoomed')) {
                    e.preventDefault();
                    endCoords = e.targetTouches[0].pageX;
                    _this.touchMove(startCoords, endCoords);
                    isMoved = true;
                }
            });
        }

        for (var k = 0; k < _this.___slide.length; k++) {
            /*jshint loopfunc: true */
            utils.on(_this.___slide[k], 'touchend.lg', function() {
                if (!utils.hasClass(_this.outer, 'lg-zoomed')) {
                    if (isMoved) {
                        isMoved = false;
                        _this.touchEnd(endCoords - startCoords);
                    } else {
                        utils.trigger(_this.el, 'onSlideClick');
                    }
                }
            });
        }
    }

};

Plugin.prototype.enableDrag = function() {
    var _this = this;
    var startCoords = 0;
    var endCoords = 0;
    var isDraging = false;
    var isMoved = false;
    if (_this.s.enableDrag && !_this.isTouch && _this.doCss()) {
        for (var i = 0; i < _this.___slide.length; i++) {
            /*jshint loopfunc: true */
            utils.on(_this.___slide[i], 'mousedown.lg', function(e) {
                // execute only on .lg-object
                if (!utils.hasClass(_this.outer, 'lg-zoomed')) {
                    if (utils.hasClass(e.target, 'lg-object') || utils.hasClass(e.target, 'lg-video-play')) {
                        e.preventDefault();

                        if (!_this.lgBusy) {
                            _this.manageSwipeClass();
                            startCoords = e.pageX;
                            isDraging = true;

                            // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                            _this.outer.scrollLeft += 1;
                            _this.outer.scrollLeft -= 1;

                            // *

                            utils.removeClass(_this.outer, 'lg-grab');
                            utils.addClass(_this.outer, 'lg-grabbing');

                            utils.trigger(_this.el, 'onDragstart');
                        }

                    }
                }
            });
        }

        utils.on(window, 'mousemove.lg', function(e) {
            if (isDraging) {
                isMoved = true;
                endCoords = e.pageX;
                _this.touchMove(startCoords, endCoords);
                utils.trigger(_this.el, 'onDragmove');
            }
        });

        utils.on(window, 'mouseup.lg', function(e) {
            if (isMoved) {
                isMoved = false;
                _this.touchEnd(endCoords - startCoords);
                utils.trigger(_this.el, 'onDragend');
            } else if (utils.hasClass(e.target, 'lg-object') || utils.hasClass(e.target, 'lg-video-play')) {
                utils.trigger(_this.el, 'onSlideClick');
            }

            // Prevent execution on click
            if (isDraging) {
                isDraging = false;
                utils.removeClass(_this.outer, 'lg-grabbing');
                utils.addClass(_this.outer, 'lg-grab');
            }
        });

    }
};

Plugin.prototype.manageSwipeClass = function() {
    var touchNext = this.index + 1;
    var touchPrev = this.index - 1;
    var length = this.___slide.length;
    if (this.s.loop) {
        if (this.index === 0) {
            touchPrev = length - 1;
        } else if (this.index === length - 1) {
            touchNext = 0;
        }
    }

    for (var i = 0; i < this.___slide.length; i++) {
        utils.removeClass(this.___slide[i], 'lg-next-slide');
        utils.removeClass(this.___slide[i], 'lg-prev-slide');
    }

    if (touchPrev > -1) {
        utils.addClass(this.___slide[touchPrev], 'lg-prev-slide');
    }

    utils.addClass(this.___slide[touchNext], 'lg-next-slide');
};

Plugin.prototype.mousewheel = function() {
    var _this = this;
    utils.on(_this.outer, 'mousewheel.lg', function(e) {

        if (!e.deltaY) {
            return;
        }

        if (e.deltaY > 0) {
            _this.goToPrevSlide();
        } else {
            _this.goToNextSlide();
        }

        e.preventDefault();
    });

};

Plugin.prototype.closeGallery = function() {

    var _this = this;
    var mousedown = false;
    utils.on(this.outer.querySelector('.lg-close'), 'click.lg', function() {
        _this.destroy();
    });

    if (_this.s.closable) {

        // If you drag the slide and release outside gallery gets close on chrome
        // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
        utils.on(_this.outer, 'mousedown.lg', function(e) {

            if (utils.hasClass(e.target, 'lg-outer') || utils.hasClass(e.target, 'lg-item') || utils.hasClass(e.target, 'lg-img-wrap')) {
                mousedown = true;
            } else {
                mousedown = false;
            }

        });

        utils.on(_this.outer, 'mouseup.lg', function(e) {

            if (utils.hasClass(e.target, 'lg-outer') || utils.hasClass(e.target, 'lg-item') || utils.hasClass(e.target, 'lg-img-wrap') && mousedown) {
                if (!utils.hasClass(_this.outer, 'lg-dragging')) {
                    _this.destroy();
                }
            }

        });

    }

};

Plugin.prototype.destroy = function(d) {

    var _this = this;

    if (!d) {
        utils.trigger(_this.el, 'onBeforeClose');
    }

    document.body.scrollTop = _this.prevScrollTop;
    document.documentElement.scrollTop = _this.prevScrollTop;

    /**
     * if d is false or undefined destroy will only close the gallery
     * plugins instance remains with the element
     *
     * if d is true destroy will completely remove the plugin
     */

    if (d) {
        if (!_this.s.dynamic) {
            // only when not using dynamic mode is $items a jquery collection

            for (var i = 0; i < this.items.length; i++) {
                utils.off(this.items[i], '.lg');
                utils.off(this.items[i], '.lgcustom');
            }
        }

        let lguid = _this.el.getAttribute('lg-uid');
        delete window.lgData[lguid];
        _this.el.removeAttribute('lg-uid');
    }

    // Unbind all events added by lightGallery
    utils.off(this.el, '.lgtm');

    // Distroy all lightGallery modules
    for (var key in window.lgModules) {
        if (_this.modules[key]) {
            _this.modules[key].destroy(d);
        }
    }

    this.lGalleryOn = false;

    clearTimeout(_this.hideBartimeout);
    this.hideBartimeout = false;
    utils.off(window, '.lg');
    utils.removeClass(document.body, 'lg-on');
    utils.removeClass(document.body, 'lg-from-hash');

    if (_this.outer) {
        utils.removeClass(_this.outer, 'lg-visible');
    }

    utils.removeClass(document.querySelector('.lg-backdrop'), 'in');
    setTimeout(function() {
        try {
            if (_this.outer) {
                _this.outer.parentNode.removeChild(_this.outer);
            }

            if (document.querySelector('.lg-backdrop')) {
                document.querySelector('.lg-backdrop').parentNode.removeChild(document.querySelector('.lg-backdrop'));
            }

            if (!d) {
                utils.trigger(_this.el, 'onCloseAfter');
            }
        } catch (err) {}

    }, _this.s.backdropDuration + 50);
};

window.lightGallery = function(el, options) {
    if (!el) {
        return;
    }

    try {
        if (!el.getAttribute('lg-uid')) {
            let uid = 'lg' + window.lgData.uid++;
            window.lgData[uid] = new Plugin(el, options);
            el.setAttribute('lg-uid', uid);
        } else {
            try {
                window.lgData[el.getAttribute('lg-uid')].init();
            } catch (err) {
                console.error('lightGallery has not initiated properly');
            }
        }
    } catch (err) {
        console.error('lightGallery has not initiated properly');
    }
};
