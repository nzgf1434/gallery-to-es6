export default function arrowDisableModul(index) {

    // Disable arrows if s.hideControlOnEnd is true
    if (!this.s.loop && this.s.hideControlOnEnd) {
        let next = this.outer.querySelector('.lg-next');
        let prev = this.outer.querySelector('.lg-prev');
        if ((index + 1) < this.___slide.length) {
            next.removeAttribute('disabled');
            utils.removeClass(next, 'disabled');
        } else {
            next.setAttribute('disabled', 'disabled');
            utils.addClass(next, 'disabled');
        }

        if (index > 0) {
            prev.removeAttribute('disabled');
            utils.removeClass(prev, 'disabled');
        } else {
            prev.setAttribute('disabled', 'disabled');
            utils.addClass(prev, 'disabled');
        }
    }
};