export default function initModul() {

    var _this = this;

    // s.preload should not be more than $item.length
    if (_this.s.preload > _this.items.length) {
        _this.s.preload = _this.items.length;
    }

    // if dynamic option is enabled execute immediately
    var _hash = window.location.hash;
    if (_hash.indexOf('lg=' + this.s.galleryId) > 0) {

        _this.index = parseInt(_hash.split('&slide=')[1], 10);

        utils.addClass(document.body, 'lg-from-hash');
        if (!utils.hasClass(document.body, 'lg-on')) {
            utils.addClass(document.body, 'lg-on');
            setTimeout(function() {
                _this.build(_this.index);
            });
        }
    }

    if (_this.s.dynamic) {

        utils.trigger(this.el, 'onBeforeOpen');

        _this.index = _this.s.index || 0;

        // prevent accidental double execution
        if (!utils.hasClass(document.body, 'lg-on')) {
            utils.addClass(document.body, 'lg-on');
            setTimeout(function() {
                _this.build(_this.index);
            });
        }
    } else {

        for (var i = 0; i < _this.items.length; i++) {

            /*jshint loopfunc: true */
            (function(index) {

                // Using different namespace for click because click event should not unbind if selector is same object('this')
                utils.on(_this.items[index], 'click.lgcustom', (e) => {

                    e.preventDefault();

                    utils.trigger(_this.el, 'onBeforeOpen');

                    _this.index = _this.s.index || index;

                    if (!utils.hasClass(document.body, 'lg-on')) {
                        _this.build(_this.index);
                        utils.addClass(document.body, 'lg-on');
                    }
                });

            })(i);

        }

    }

};