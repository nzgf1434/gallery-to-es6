/**
 *  @desc add sub-html into the slide
 *  @param {Number} index - index of the slide
 */

export default function addHtmlModul(index) {
    var subHtml = null;
    var currentEle;
    if (this.s.dynamic) {
        subHtml = this.s.dynamicEl[index].subHtml;
    } else {
        currentEle = this.items[index];
        subHtml = currentEle.getAttribute('data-sub-html');
        if (this.s.getCaptionFromTitleOrAlt && !subHtml) {
            subHtml = currentEle.getAttribute('title');
            if (subHtml && currentEle.querySelector('img')) {
                subHtml = currentEle.querySelector('img').getAttribute('alt');
            }
        }
    }

    if (typeof subHtml !== 'undefined' && subHtml !== null) {

        // get first letter of subhtml
        // if first letter starts with . or # get the html form the jQuery object
        var fL = subHtml.substring(0, 1);
        if (fL === '.' || fL === '#') {
            if (this.s.subHtmlSelectorRelative && !this.s.dynamic) {
                subHtml = currentEle.querySelector(subHtml).innerHTML;
            } else {
                subHtml = document.querySelector(subHtml).innerHTML;
            }
        }
    } else {
        subHtml = '';
    }

    if (this.s.appendSubHtmlTo === '.lg-sub-html') {
        this.outer.querySelector(this.s.appendSubHtmlTo).innerHTML = subHtml;
    } else {
        this.___slide[index].insertAdjacentHTML('beforeend', subHtml);
    }

    // Add lg-empty-html class if title doesn't exist
    if (typeof subHtml !== 'undefined' && subHtml !== null) {
        if (subHtml === '') {
            utils.addClass(this.outer.querySelector(this.s.appendSubHtmlTo), 'lg-empty-html');
        } else {
            utils.removeClass(this.outer.querySelector(this.s.appendSubHtmlTo), 'lg-empty-html');
        }
    }

    utils.trigger(this.el, 'onAfterAppendSubHtml', {
        index: index
    });
};