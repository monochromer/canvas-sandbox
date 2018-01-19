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

function getYScroll() {
    return window.scrollY;
}

function getViewportH() {
    return Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
    );
}

function getDocumentHeight() {
    return Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );
};

function getMaxScroll() {
    return getDocumentHeight() - getViewportH();
};

var images = [
    {
        url: 'parallax-bg-1.png',
        factor: -0.8001,
        image: null,
        count: 1
    },
    {
        url: 'parallax-bg-2.png',
        factor: -0.6001,
        image: null,
        count: 1
    },
    {
        url: 'parallax-bg-3.png',
        factor: -0.4001,
        image: null,
        count: 1
    },
    {
        url: 'parallax-bg-4.png',
        factor: -0.2001,
        image: null,
        count: 1
    }
];

var baseUrl = 'img/';
var mult = 0.5;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var viewH = getViewportH();
var [w, h] = [canvas.offsetWidth, canvas.offsetHeight];
var [hw, hh] = [0.5 * w, 0.5 * h];
var dpx = devicePixelRatio || 1;
canvas.width = w * dpx;
canvas.height = h * dpx;
ctx.scale(dpx, dpx);

function render() {
    ctx.clearRect(0, 0, w, h);
    images.forEach(({
        image, factor, count,
        nW, nH,
        W, H
    }) => {
        let scroll = getYScroll();
        let scrolled = ((scroll * factor) % H);
        for(let i = 0; i <= count; i = i + 1) {
            ctx.drawImage(
                image, 0,  0, nW, nH,
                hw - 0.5 * W,
                scrolled + i * H,
                W, H
            );
        };
    });
}

Promise
    .all(images.map(imageItem => {
        return loadImage(`${baseUrl}${imageItem.url}`)
            .then(img => {
                imageItem.image = img;
                imageItem.nW = img.naturalWidth;
                imageItem.nH = img.naturalHeight;
                imageItem.W = mult * img.naturalWidth;
                imageItem.H = mult * img.naturalHeight;
                imageItem.count = Math.ceil(viewH / (img.naturalHeight * mult));
            })
        })
    )
    .then(() => {
        decouple(window, 'scroll', render);
        render();
    });