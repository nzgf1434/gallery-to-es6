/**
 *  @desc Preload slides
 *  @param {Number} index - index of the slide
 */

export default function preloadModul(index) {
    var i = 1;
    var j = 1;
    for (i = 1; i <= this.s.preload; i++) {
        if (i >= this.items.length - index) {
            break;
        }

        this.loadContent(index + i, false, 0);
    }

    for (j = 1; j <= this.s.preload; j++) {
        if (index - j < 0) {
            break;
        }

        this.loadContent(index - j, false, 0);
    }
};