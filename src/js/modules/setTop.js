export default function setTopModul() {
    if (this.s.height !== '100%') {
        let wH = window.innerHeight;
        let top = (wH - parseInt(this.s.height, 10)) / 2;
        let lGallery = this.outer.querySelector('.lg');
        if (wH >= parseInt(this.s.height, 10)) {
            lGallery.style.top = top + 'px';
        } else {
            lGallery.style.top = '0px';
        }
    }
};