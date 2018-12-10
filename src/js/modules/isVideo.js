/**
 *  @desc Check the given src is video
 *  @param {String} src
 *  @return {Object} video type
 *  Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
 */

export default function isVideoModul(src, index) {

    var html;
    if (this.s.dynamic) {
        html = this.s.dynamicEl[index].html;
    } else {
        html = this.items[index].getAttribute('data-html');
    }

    if (!src && html) {
        return {
            html5: true
        };
    }

    var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i);
    var vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
    var dailymotion = src.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i);
    var vk = src.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);

    if (youtube) {
        return {
            youtube: youtube
        };
    } else if (vimeo) {
        return {
            vimeo: vimeo
        };
    } else if (dailymotion) {
        return {
            dailymotion: dailymotion
        };
    } else if (vk) {
        return {
            vk: vk
        };
    }
};