/**
 *  @desc Load slide content into slide.
 *  @param {Number} index - index of the slide.
 *  @param {Boolean} rec - if true call loadcontent() function again.
 *  @param {Boolean} delay - delay for adding complete class. it is 0 except first time.
 */

export default function loadContentModul(index, rec, delay) {

    var _this = this;
    var _hasPoster = false;
    var _img;
    var _src;
    var _poster;
    var _srcset;
    var _sizes;
    var _html;
    var getResponsiveSrc = function(srcItms) {
        var rsWidth = [];
        var rsSrc = [];
        for (var i = 0; i < srcItms.length; i++) {
            var __src = srcItms[i].split(' ');

            // Manage empty space
            if (__src[0] === '') {
                __src.splice(0, 1);
            }

            rsSrc.push(__src[0]);
            rsWidth.push(__src[1]);
        }

        var wWidth = window.innerWidth;
        for (var j = 0; j < rsWidth.length; j++) {
            if (parseInt(rsWidth[j], 10) > wWidth) {
                _src = rsSrc[j];
                break;
            }
        }
    };

    if (_this.s.dynamic) {

        if (_this.s.dynamicEl[index].poster) {
            _hasPoster = true;
            _poster = _this.s.dynamicEl[index].poster;
        }

        _html = _this.s.dynamicEl[index].html;
        _src = _this.s.dynamicEl[index].src;

        if (_this.s.dynamicEl[index].responsive) {
            var srcDyItms = _this.s.dynamicEl[index].responsive.split(',');
            getResponsiveSrc(srcDyItms);
        }

        _srcset = _this.s.dynamicEl[index].srcset;
        _sizes = _this.s.dynamicEl[index].sizes;

    } else {

        if (_this.items[index].getAttribute('data-poster')) {
            _hasPoster = true;
            _poster = _this.items[index].getAttribute('data-poster');
        }

        _html = _this.items[index].getAttribute('data-html');
        _src = _this.items[index].getAttribute('href') || _this.items[index].getAttribute('data-src');

        if (_this.items[index].getAttribute('data-responsive')) {
            var srcItms = _this.items[index].getAttribute('data-responsive').split(',');
            getResponsiveSrc(srcItms);
        }

        _srcset = _this.items[index].getAttribute('data-srcset');
        _sizes = _this.items[index].getAttribute('data-sizes');

    }

    //if (_src || _srcset || _sizes || _poster) {

    var iframe = false;
    if (_this.s.dynamic) {
        if (_this.s.dynamicEl[index].iframe) {
            iframe = true;
        }
    } else {
        if (_this.items[index].getAttribute('data-iframe') === 'true') {
            iframe = true;
        }
    }

    var _isVideo = _this.isVideo(_src, index);
    if (!utils.hasClass(_this.___slide[index], 'lg-loaded')) {
        if (iframe) {
            _this.___slide[index].insertAdjacentHTML('afterbegin', '<div class="lg-video-cont" style="max-width:' + _this.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + _src + '"  allowfullscreen="true"></iframe></div></div>');
        } else if (_hasPoster) {
            var videoClass = '';
            if (_isVideo && _isVideo.youtube) {
                videoClass = 'lg-has-youtube';
            } else if (_isVideo && _isVideo.vimeo) {
                videoClass = 'lg-has-vimeo';
            } else {
                videoClass = 'lg-has-html5';
            }

            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont ' + videoClass + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + _poster + '" /></div></div>');

        } else if (_isVideo) {
            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont "><div class="lg-video"></div></div>');
            utils.trigger(_this.el, 'hasVideo', {
                index: index,
                src: _src,
                html: _html
            });
        } else {
            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-img-wrap"><img class="lg-object lg-image" src="' + _src + '" /></div>');
        }

        utils.trigger(_this.el, 'onAferAppendSlide', {
            index: index
        });

        _img = _this.___slide[index].querySelector('.lg-object');
        if (_sizes) {
            _img.setAttribute('sizes', _sizes);
        }

        if (_srcset) {
            _img.setAttribute('srcset', _srcset);
            try {
                picturefill({
                    elements: [_img[0]]
                });
            } catch (e) {
                console.error('Make sure you have included Picturefill version 2');
            }
        }

        if (this.s.appendSubHtmlTo !== '.lg-sub-html') {
            _this.addHtml(index);
        }

        utils.addClass(_this.___slide[index], 'lg-loaded');
    }

    utils.on(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', function() {

        // For first time add some delay for displaying the start animation.
        var _speed = 0;

        // Do not change the delay value because it is required for zoom plugin.
        // If gallery opened from direct url (hash) speed value should be 0
        if (delay && !utils.hasClass(document.body, 'lg-from-hash')) {
            _speed = delay;
        }

        setTimeout(function() {
            utils.addClass(_this.___slide[index], 'lg-complete');

            utils.trigger(_this.el, 'onSlideItemLoad', {
                index: index,
                delay: delay || 0
            });
        }, _speed);

    });

    // @todo check load state for html5 videos
    if (_isVideo && _isVideo.html5 && !_hasPoster) {
        utils.addClass(_this.___slide[index], 'lg-complete');
    }

    if (rec === true) {
        if (!utils.hasClass(_this.___slide[index], 'lg-complete')) {
            utils.on(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', function() {
                _this.preload(index);
            });
        } else {
            _this.preload(index);
        }
    }

    //}
};