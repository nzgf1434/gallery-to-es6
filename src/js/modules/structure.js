export default function structureModul() {
    var list = '';
    var controls = '';
    var i = 0;
    var subHtmlCont = '';
    var template;
    var _this = this;

    document.body.insertAdjacentHTML('beforeend', '<div class="lg-backdrop"></div>');
    utils.setVendor(document.querySelector('.lg-backdrop'), 'TransitionDuration', this.s.backdropDuration + 'ms');

    // Create gallery items
    for (i = 0; i < this.items.length; i++) {
        list += '<div class="lg-item"></div>';
    }

    // Create controlls
    if (this.s.controls && this.items.length > 1) {
        controls = '<div class="lg-actions">' +
            '<div class="lg-prev lg-icon">' + this.s.prevHtml + '</div>' +
            '<div class="lg-next lg-icon">' + this.s.nextHtml + '</div>' +
            '</div>';
    }

    if (this.s.appendSubHtmlTo === '.lg-sub-html') {
        subHtmlCont = '<div class="lg-sub-html"></div>';
    }

    template = '<div class="lg-outer ' + this.s.addClass + ' ' + this.s.startClass + '">' +
        '<div class="lg" style="width:' + this.s.width + '; height:' + this.s.height + '">' +
        '<div class="lg-inner">' + list + '</div>' +
        '<div class="lg-toolbar group">' +
        '<span class="lg-close lg-icon"></span>' +
        '</div>' +
        controls +
        subHtmlCont +
        '</div>' +
        '</div>';

    document.body.insertAdjacentHTML('beforeend', template);
    this.outer = document.querySelector('.lg-outer');
    this.___slide = this.outer.querySelectorAll('.lg-item');

    if (this.s.useLeft) {
        utils.addClass(this.outer, 'lg-use-left');

        // Set mode lg-slide if use left is true;
        this.s.mode = 'lg-slide';
    } else {
        utils.addClass(this.outer, 'lg-use-css3');
    }

    // For fixed height gallery
    _this.setTop();
    utils.on(window, 'resize.lg orientationchange.lg', function() {
        setTimeout(function() {
            _this.setTop();
        }, 100);
    });

    // add class lg-current to remove initial transition
    utils.addClass(this.___slide[this.index], 'lg-current');

    // add Class for css support and transition mode
    if (this.doCss()) {
        utils.addClass(this.outer, 'lg-css3');
    } else {
        utils.addClass(this.outer, 'lg-css');

        // Set speed 0 because no animation will happen if browser doesn't support css3
        this.s.speed = 0;
    }

    utils.addClass(this.outer, this.s.mode);

    if (this.s.enableDrag && this.items.length > 1) {
        utils.addClass(this.outer, 'lg-grab');
    }

    if (this.s.showAfterLoad) {
        utils.addClass(this.outer, 'lg-show-after-load');
    }

    if (this.doCss()) {
        let inner = this.outer.querySelector('.lg-inner');
        utils.setVendor(inner, 'TransitionTimingFunction', this.s.cssEasing);
        utils.setVendor(inner, 'TransitionDuration', this.s.speed + 'ms');
    }

    setTimeout(function() {
        utils.addClass(document.querySelector('.lg-backdrop'), 'in');
    });


    setTimeout(function() {
        utils.addClass(_this.outer, 'lg-visible');
    }, this.s.backdropDuration);

    if (this.s.download) {
        this.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', '<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>');
    }

    // Store the current scroll top value to scroll back after closing the gallery..
    this.prevScrollTop = (document.documentElement.scrollTop || document.body.scrollTop)

};