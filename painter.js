;(function() {
    'use strict';

    function getDevicePixelRatio() {
        return devicePixelRatio
            || webkitDevicePixelRatio
            || (window.screen.deviceXDPI / window.screen.logicalXDPI)
            || 1;
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
        var w = canvas.clientWidth;
        var h = canvas.clientHeight;
        canvas.width = w * dpx;
        canvas.height = h * dpx;
        ctx.scale(dpx, dpx);

        // setupAPI(self, ctx , API);

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