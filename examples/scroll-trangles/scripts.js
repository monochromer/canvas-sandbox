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

var images = [
    {
        url: 'parallax-bg-1.png',
        factor: 0.8,
        image: null
    },
    {
        url: 'parallax-bg-2.png',
        factor: 0.6,
        image: null
    },
    {
        url: 'parallax-bg-3.png',
        factor: 0.4,
        image: null
    },
    {
        url: 'parallax-bg-4.png',
        factor: 0.2,
        image: null
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
    images.forEach(({ image, factor }) => {
        let [nW, nH] = [image.naturalWidth, image.naturalHeight];
        let [W, H] = [mult * nW, mult * nH];
        let scrolled = -1 * getYScroll() * factor;
        let count = Math.ceil((viewH - scrolled * H) / H);
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

function onScroll(e) {
    render();
}

Promise
    .all(images.map((imageItem) => {
        return loadImage(`${baseUrl}${imageItem.url}`)
            .then(img => imageItem.image = img)
        })
    )
    .then(() => {
        decouple(window, 'scroll', onScroll);
        render();
    });