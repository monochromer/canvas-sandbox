function decouple(node, event, fn) {
    var eve,
        tracking = false;

    function captureEvent(e) {
      eve = e;
      track();
    }

    function track() {
      if (!tracking) {
        requestAnimationFrame(update);
        tracking = true;
      }
    }

    function update() {
      fn.call(node, eve);
      tracking = false;
    }

    node.addEventListener(event, captureEvent, false);

    return captureEvent;
}

function rafThrottle(action) {
  let isRunning = false;
  return function(...args) {
    if (isRunning) return;
    isRunning = true;
    window.requestAnimationFrame(() => {
    action(...args);
      isRunning = false;
    });
  }
}