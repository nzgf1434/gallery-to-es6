export default function buildModul(index) {

    var _this = this;

    _this.structure();

    for (var key in window.lgModules) {
        _this.modules[key] = new window.lgModules[key](_this.el);
    }

    // initiate slide function
    _this.slide(index, false, false);

    if (_this.s.keyPress) {
        _this.keyPress();
    }

    if (_this.items.length > 1) {

        _this.arrow();

        setTimeout(function() {
            _this.enableDrag();
            _this.enableSwipe();
        }, 50);

        if (_this.s.mousewheel) {
            _this.mousewheel();
        }
    }

    _this.counter();

    _this.closeGallery();

    utils.trigger(_this.el, 'onAfterOpen');

    // Hide controllers if mouse doesn't move for some period
    utils.on(_this.outer, 'mousemove.lg click.lg touchstart.lg', function() {

        utils.removeClass(_this.outer, 'lg-hide-items');

        clearTimeout(_this.hideBartimeout);

        // Timeout will be cleared on each slide movement also
        _this.hideBartimeout = setTimeout(function() {
            utils.addClass(_this.outer, 'lg-hide-items');
        }, _this.s.hideBarsDelay);

    });

};