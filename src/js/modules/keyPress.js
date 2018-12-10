export default function keyPressModul() {
    var _this = this;
    if (this.items.length > 1) {
        utils.on(window, 'keyup.lg', function(e) {
            if (_this.items.length > 1) {
                if (e.keyCode === 37) {
                    e.preventDefault();
                    _this.goToPrevSlide();
                }

                if (e.keyCode === 39) {
                    e.preventDefault();
                    _this.goToNextSlide();
                }
            }
        });
    }

    utils.on(window, 'keydown.lg', function(e) {
        if (_this.s.escKey === true && e.keyCode === 27) {
            e.preventDefault();
            if (!utils.hasClass(_this.outer, 'lg-thumb-open')) {
                _this.destroy();
            } else {
                utils.removeClass(_this.outer, 'lg-thumb-open');
            }
        }
    });
};
