/**
 *  @desc Create image counter
 *  Ex: 1/10
 */

export default function counterModul() {
    if (this.s.counter) {
        this.outer.querySelector(this.s.appendCounterTo).insertAdjacentHTML('beforeend', '<div id="lg-counter"><span id="lg-counter-current">' + (parseInt(this.index, 10) + 1) + '</span> / <span id="lg-counter-all">' + this.items.length + '</span></div>');
    }
};