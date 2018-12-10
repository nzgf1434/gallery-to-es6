export default function doCssModul() {
    // check for css animation support
    var support = function() {
        var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
        var root = document.documentElement;
        var i = 0;
        for (i = 0; i < transition.length; i++) {
            if (transition[i] in root.style) {
                return true;
            }
        }
    };

    if (support()) {
        return true;
    }

    return false;
};