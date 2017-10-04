function loadImage(url) {
    return new Promise((resolve, reject) => {
        var image = new Image;
        image.onload = () => {
            image.onload = image.onerror = null;
            resolve(image);
        };
        image.onerror = (err) => {
            image.onload = image.onerror = null;
            reject(err);
        };
        image.src = url;
    });
}

var images = [];

var baseUrl = '/img/';

var urls = [
    'parallax-bg-1.png',
    'parallax-bg-2.png',
    'parallax-bg-3.png',
    'parallax-bg-4.png'
];

var factors = [0.2, 0.4, 0.6, 0.8];

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var [w, h] = [canvas.offsetWidth, canvas.offsetHeight];
var [hw, hh] = [0.5 * w, 0.5 * h];
var dpx = devicePixelRatio || 1;
canvas.width = w * dpx;
canvas.height = h * dpx;
ctx.scale(dpx, dpx);

urls.map(url => {
    loadImage(baseUrl + url)
        .then(img => {
            images.push(img);
            render();
        });
});

function getYScroll() {
    return window.scrollY;
}

function render() {
    var mult = 0.5;
    ctx.clearRect(0, 0, w, h);
    images.forEach((img, idx) => {
        ctx.drawImage(
            img,
            0, 0,
            img.naturalWidth, img.naturalHeight,
            hw - 0.5 * mult * img.naturalWidth, -1 * getYScroll() * factors[idx],
            mult * img.naturalWidth, mult * img.naturalHeight
        );
    });
}

function onScroll(e) {
    render();
}

decouple(window, 'scroll', onScroll);