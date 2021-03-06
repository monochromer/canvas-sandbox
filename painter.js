;(function() {
    'use strict';

    function getDevicePixelRatio() {
        return devicePixelRatio
            || webkitDevicePixelRatio
            || (window.screen.deviceXDPI / window.screen.logicalXDPI)
            || 1;
    }

    function loadImage(url, callback) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.onload = function() {
                img.onload = img.onerror = null;
                callback(null, img);
                resolve(img);
            }
            img.onerror = function(e) {
                img.onload = img.onerror = null;
                callback(e, null);
                reject(e);
            }
            img.src  = url;
        })
    }

    // function setupAPI(self, canvasContext, API) {
    //     var hasOwn = Object.prototype.hasOwnProperty;
    //     var slice = Array.prototype.slice;
    //     for (var method in API) {
    //         if (hasOwn.call(API, method)) {
    //             self[method] = function() {
    //                 API[method].apply(self, [canvasContext].concat(slice.apply(arguments)));
    //                 return self;
    //             }
    //         }
    //     }
    // }

    // var API = {
    //     fn: function(ctx) {
    //         console.log(ctx);
    //     }
    // };

    function Painter(canvasElement) {
        if (!(this instanceof Painter)) {
            return new Painter(canvasElement);
        }

        var self = this;
        var canvas = typeof canvasElement === 'string'
            ? document.querySelector(canvasElement)
            : canvasElement;
        var ctx = canvas.getContext('2d');
        var isLoop = false;

        var dpx = getDevicePixelRatio();

        // setupAPI(self, ctx , API);
        self.calcSize = function() {
            dpx = getDevicePixelRatio()
            var w = canvas.clientWidth;
            var h = canvas.clientHeight;
            canvas.width = w * dpx;
            canvas.height = h * dpx;
            ctx.scale(dpx, dpx);
        }

        self.calcSize();

        // API
        self.getWidth = function() {
            return canvas.width / dpx;
        }

        self.getHeight = function() {
            return canvas.height / dpx;
        }

        self.getCanvas = function() {
            return canvas;
        }

        self.getContext = function() {
            return ctx;
        }

        self.isCanvasSupport = function() {
            return !!canvas.getContext;
        }

        self.saveToImage = function(fileName) {
            // window.open(
            //     canvas.toDataURL(),
            //     'canvasImage',
            //     'left=0,top=0,width=' + canvas.width + ',height=' + canvas.height + ',toolbar=0,resizable=0'
            // );
            var link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = fileName;
            link.click();
            link.remove();
        }

        // self.loadImage = function(url) {
        //     loadImage(url)
        //         .then(function(image) {})
        // }

        self.on = function(eventName, callback) {
            canvas.addEventListener(eventName, callback);
            return self;
        }

        self.off = function(eventName, callback) {
            canvas.removeEventListener(eventName, callback);
            return self;
        }

        self.fn = function(cb) {
            typeof cb === 'function' ? (function() {
                cb(ctx);
            })() : !1;
            return self;
        };

        self.clear = function(onClear) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            typeof onClear === 'function' ? (function() {
                onClear(ctx);
            })() : !1;
            return self;
        };

        self.path = function(cb) {
            ctx.beginPath();
            cb(ctx);
            ctx.closePath();
            return self;
        };

        self.polyline = function(points) {
            ctx.beginPath();
            var pnts = points.slice(1);
            ctx.moveTo(points[0][0], points[0][1]);
            pnts.forEach(function(point) {
                ctx.lineTo(point[0], point[1]);
            });
            ctx.stroke();
            ctx.closePath();
            return self;
        };

        self.loop = function(fn) {
            isLoop = true;

            function update() {
                if (!isLoop) {
                    return;
                };
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                typeof fn === 'function' ? fn(ctx) : !1;
                requestAnimationFrame(update);
            };

            update();
            return self;
        };

        self.stop = function(onStop) {
            isLoop = false;
            typeof onStop === 'function' ? onStop(ctx) : !1;
            return self;
        }
    }

    window.Painter = Painter;

})();