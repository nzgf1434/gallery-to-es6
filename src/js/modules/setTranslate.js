export default function setTranslateModul(el, xValue, yValue) {
    // jQuery supports Automatic CSS prefixing since jQuery 1.8.0
    if (this.s.useLeft) {
        el.style.left = xValue;
    } else {
        utils.setVendor(el, 'Transform', 'translate3d(' + (xValue) + 'px, ' + yValue + 'px, 0px)');
    }
};