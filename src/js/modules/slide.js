/**
*   @desc slide function for lightgallery
    ** Slide() gets call on start
    ** ** Set lg.on true once slide() function gets called.
    ** Call loadContent() on slide() function inside setTimeout
    ** ** On first slide we do not want any animation like slide of fade
    ** ** So on first slide( if lg.on if false that is first slide) loadContent() should start loading immediately
    ** ** Else loadContent() should wait for the transition to complete.
    ** ** So set timeout s.speed + 50
<=> ** loadContent() will load slide content in to the particular slide
    ** ** It has recursion (rec) parameter. if rec === true loadContent() will call preload() function.
    ** ** preload will execute only when the previous slide is fully loaded (images iframe)
    ** ** avoid simultaneous image load
<=> ** Preload() will check for s.preload value and call loadContent() again accoring to preload value
    ** loadContent()  <====> Preload();

*   @param {Number} index - index of the slide
*   @param {Boolean} fromTouch - true if slide function called via touch event or mouse drag
*   @param {Boolean} fromThumb - true if slide function called via thumbnail click
*/

export default function slideModul(index, fromTouch, fromThumb) {

    var _prevIndex = 0;
    for (var i = 0; i < this.___slide.length; i++) {
        if (utils.hasClass(this.___slide[i], 'lg-current')) {
            _prevIndex = i;
            break;
        }
    }

    var _this = this;

    // Prevent if multiple call
    // Required for hsh plugin
    if (_this.lGalleryOn && (_prevIndex === index)) {
        return;
    }

    var _length = this.___slide.length;
    var _time = _this.lGalleryOn ? this.s.speed : 0;
    var _next = false;
    var _prev = false;

    if (!_this.lgBusy) {

        if (this.s.download) {
            var _src;
            if (_this.s.dynamic) {
                _src = _this.s.dynamicEl[index].downloadUrl !== false && (_this.s.dynamicEl[index].downloadUrl || _this.s.dynamicEl[index].src);
            } else {
                _src = _this.items[index].getAttribute('data-download-url') !== 'false' && (_this.items[index].getAttribute('data-download-url') || _this.items[index].getAttribute('href') || _this.items[index].getAttribute('data-src'));

            }

            if (_src) {
                document.getElementById('lg-download').setAttribute('href', _src);
                utils.removeClass(_this.outer, 'lg-hide-download');
            } else {
                utils.addClass(_this.outer, 'lg-hide-download');
            }
        }

        utils.trigger(_this.el, 'onBeforeSlide', {
            prevIndex: _prevIndex,
            index: index,
            fromTouch: fromTouch,
            fromThumb: fromThumb
        });

        _this.lgBusy = true;

        clearTimeout(_this.hideBartimeout);

        // Add title if this.s.appendSubHtmlTo === lg-sub-html
        if (this.s.appendSubHtmlTo === '.lg-sub-html') {

            // wait for slide animation to complete
            setTimeout(function() {
                _this.addHtml(index);
            }, _time);
        }

        this.arrowDisable(index);

        if (!fromTouch) {

            // remove all transitions
            utils.addClass(_this.outer, 'lg-no-trans');

            for (var j = 0; j < this.___slide.length; j++) {
                utils.removeClass(this.___slide[j], 'lg-prev-slide');
                utils.removeClass(this.___slide[j], 'lg-next-slide');
            }

            if (index < _prevIndex) {
                _prev = true;
                if ((index === 0) && (_prevIndex === _length - 1) && !fromThumb) {
                    _prev = false;
                    _next = true;
                }
            } else if (index > _prevIndex) {
                _next = true;
                if ((index === _length - 1) && (_prevIndex === 0) && !fromThumb) {
                    _prev = true;
                    _next = false;
                }
            }

            if (_prev) {

                //prevslide
                utils.addClass(this.___slide[index], 'lg-prev-slide');
                utils.addClass(this.___slide[_prevIndex], 'lg-next-slide');
            } else if (_next) {

                // next slide
                utils.addClass(this.___slide[index], 'lg-next-slide');
                utils.addClass(this.___slide[_prevIndex], 'lg-prev-slide');
            }

            // give 50 ms for browser to add/remove class
            setTimeout(function() {
                utils.removeClass(_this.outer.querySelector('.lg-current'), 'lg-current');

                //_this.$slide.eq(_prevIndex).removeClass('lg-current');
                utils.addClass(_this.___slide[index], 'lg-current');

                // reset all transitions
                utils.removeClass(_this.outer, 'lg-no-trans');
            }, 50);
        } else {

            var touchPrev = index - 1;
            var touchNext = index + 1;

            if ((index === 0) && (_prevIndex === _length - 1)) {

                // next slide
                touchNext = 0;
                touchPrev = _length - 1;
            } else if ((index === _length - 1) && (_prevIndex === 0)) {

                // prev slide
                touchNext = 0;
                touchPrev = _length - 1;
            }

            utils.removeClass(_this.outer.querySelector('.lg-prev-slide'), 'lg-prev-slide');
            utils.removeClass(_this.outer.querySelector('.lg-current'), 'lg-current');
            utils.removeClass(_this.outer.querySelector('.lg-next-slide'), 'lg-next-slide');
            utils.addClass(_this.___slide[touchPrev], 'lg-prev-slide');
            utils.addClass(_this.___slide[touchNext], 'lg-next-slide');
            utils.addClass(_this.___slide[index], 'lg-current');
        }

        if (_this.lGalleryOn) {
            setTimeout(function() {
                _this.loadContent(index, true, 0);
            }, this.s.speed + 50);

            setTimeout(function() {
                _this.lgBusy = false;
                utils.trigger(_this.el, 'onAfterSlide', {
                    prevIndex: _prevIndex,
                    index: index,
                    fromTouch: fromTouch,
                    fromThumb: fromThumb
                });
            }, this.s.speed);

        } else {
            _this.loadContent(index, true, _this.s.backdropDuration);

            _this.lgBusy = false;
            utils.trigger(_this.el, 'onAfterSlide', {
                prevIndex: _prevIndex,
                index: index,
                fromTouch: fromTouch,
                fromThumb: fromThumb
            });
        }

        _this.lGalleryOn = true;

        if (this.s.counter) {
            if (document.getElementById('lg-counter-current')) {
                document.getElementById('lg-counter-current').innerHTML = index + 1;
            }
        }

    }

};