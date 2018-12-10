/**
 *  @desc Go to previous slide
 *  @param {Boolean} fromTouch - true if slide function called via touch event
 */

 export default function previousSlideModul(fromTouch) {
    var _this = this;
    if (!_this.lgBusy) {
        if (_this.index > 0) {
            _this.index--;
            utils.trigger(_this.el, 'onBeforePrevSlide', {
                index: _this.index,
                fromTouch: fromTouch
            });
            _this.slide(_this.index, fromTouch, false);
        } else {
            if (_this.s.loop) {
                _this.index = _this.items.length - 1;
                utils.trigger(_this.el, 'onBeforePrevSlide', {
                    index: _this.index,
                    fromTouch: fromTouch
                });        // call(Plugin)
                _this.slide(_this.index, fromTouch, false);
            } else if (_this.s.slideEndAnimatoin) {
                utils.addClass(_this.outer, 'lg-left-end');
                setTimeout(function() {
                    utils.removeClass(_this.outer, 'lg-left-end');
                }, 400); // call(Plugin)
            }
        }
    }
};