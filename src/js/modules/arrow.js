export default function arrowModul() {
    var _this = this;
    utils.on(this.outer.querySelector('.lg-prev'), 'click.lg', function() {
        _this.goToPrevSlide();
    });

    utils.on(this.outer.querySelector('.lg-next'), 'click.lg', function() {
        _this.goToNextSlide();
    });
};