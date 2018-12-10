/**
 *  @desc Go to next slide
 *  @param {Boolean} fromTouch - true if slide function called via touch event
 */
export default function nextSlideModul(fromTouch) {
    var _this = this;
    if (!_this.lgBusy) {
        if ((_this.index + 1) < _this.___slide.length) {
            _this.index++;
            utils.trigger(_this.el, 'onBeforeNextSlide', {
                index: _this.index
            });
            _this.slide(_this.index, fromTouch, false);
        } else {
            if (_this.s.loop) {
                _this.index = 0;
                utils.trigger(_this.el, 'onBeforeNextSlide', {
                    index: _this.index
                });
                _this.slide(_this.index, fromTouch, false);
            } else if (_this.s.slideEndAnimatoin) {
                utils.addClass(_this.outer, 'lg-right-end');
                setTimeout(function() {
                    utils.removeClass(_this.outer, 'lg-right-end');
                }, 400);
            }
        }
    }
};