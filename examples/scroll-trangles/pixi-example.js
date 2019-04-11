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
        factor: -0.8001
    },
    {
        url: 'parallax-bg-2.png',
        factor: -0.6001
    },
    {
        url: 'parallax-bg-3.png',
        factor: -0.4001
    },
    {
        url: 'parallax-bg-4.png',
        factor: -0.2001
    }
];

var baseUrl = 'img/';
var mult = 0.5;

var canvas = document.getElementById('canvas');
// var ctx = canvas.getContext('2d');

var viewH = getViewportH();
var [w, h] = [canvas.offsetWidth, canvas.offsetHeight];
var [hw, hh] = [0.5 * w, 0.5 * h];
var dpx = devicePixelRatio || 1;
canvas.width = w * dpx;
canvas.height = h * dpx;
// ctx.scale(dpx, dpx);

var app = new PIXI.Application({
    width: w * dpx,
    height: h * dpx,
    view: canvas,
    transparent: true
});

function render() {
    images.forEach(({
        factor, count,
        nW, nH,
        W, H,
        tilingSprite
    }) => {
        // tilingSprite.tilePosition.x = (hw - 0.5 * W) * dpx;
        // tilingSprite.tilePosition.x = 0.5;
        tilingSprite.tilePosition.y = (factor * getYScroll()) * dpx;
    });
}

Promise
    .all(images.map(imageItem => {
        var url = `${baseUrl}${imageItem.url}`;
        return loadImage(url)
            .then(img => {
                imageItem.image = img;
                [imageItem.nW, imageItem.nH] = [img.naturalWidth, img.naturalHeight];
                [imageItem.W, imageItem.H] = [mult * img.naturalWidth, mult * img.naturalHeight];

                var texture = PIXI.Texture.fromImage(img.src);
                var tilingSprite = new PIXI.extras.TilingSprite(
                    texture,
                    imageItem.nW * dpx,
                    h * dpx
                );
                tilingSprite.anchor.x = 0.5;
                tilingSprite.anchor.y = 0.0;
                tilingSprite.position.x = (hw - 0.5 * imageItem.W) * dpx;
                tilingSprite.interactive = false;
                tilingSprite.buttonMode = false;
                app.stage.addChild(tilingSprite);
                imageItem.tilingSprite = tilingSprite;
            })
        })
    )
    .then(() => {
        // decouple(window, 'scroll', render);
        window.addEventListener('scroll', rafThrottle(render), {
            passive: true
        })
        render();
    });