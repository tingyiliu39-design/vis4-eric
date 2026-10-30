import { useEffect, useRef, useState } from 'react';

// Invisible pinch area over the stitch preview.
// Two fingers: spread = bigger stitch, pinch = smaller.
// On a computer: trackpad pinch or mouse wheel over the preview.
function ZoomArea({ size, onResize }) {
  const area = useRef(null);   // the element itself, only needed to attach the wheel listener

  // everything that changes during a gesture is state
  const [fingers, setFingers] = useState({});              // pointerId -> {x, y}
  const [pinchStart, setPinchStart] = useState(null);      // {distance, size} when the 2nd finger lands
  const [gestureStart, setGestureStart] = useState(1);     // stitch size when a Safari pinch begins

  function distance(points) {
    const p = Object.values(points);
    return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
  }

  // wheel and Safari gesture events need non-passive listeners, so add them here
  // (added again whenever the size changes, so they always use the newest values)
  useEffect(() => {
    const el = area.current;
    function onWheel(e) {
      e.preventDefault();
      const speed = e.ctrlKey ? 0.01 : 0.004;   // ctrlKey = trackpad pinch
      onResize(size * Math.exp(-e.deltaY * speed));
    }
    function onGestureStart(e) { e.preventDefault(); setGestureStart(size); }
    function onGestureChange(e) { e.preventDefault(); onResize(gestureStart * e.scale); }
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('gesturestart', onGestureStart);
    el.addEventListener('gesturechange', onGestureChange);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('gesturestart', onGestureStart);
      el.removeEventListener('gesturechange', onGestureChange);
    };
  }, [size, onResize, gestureStart]);

  function lift(e) {
    const next = { ...fingers };
    delete next[e.pointerId];
    setFingers(next);
    setPinchStart(null);
  }

  return (
    <div
      ref={area}
      className="zoom-area"
      aria-label="Pinch to change stitch size"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        const next = { ...fingers, [e.pointerId]: { x: e.clientX, y: e.clientY } };
        setFingers(next);
        if (Object.keys(next).length === 2) setPinchStart({ distance: distance(next), size });
      }}
      onPointerMove={(e) => {
        if (!(e.pointerId in fingers)) return;
        const next = { ...fingers, [e.pointerId]: { x: e.clientX, y: e.clientY } };
        setFingers(next);
        if (Object.keys(next).length === 2 && pinchStart && pinchStart.distance > 0) {
          onResize(pinchStart.size * distance(next) / pinchStart.distance);
        }
      }}
      onPointerUp={lift}
      onPointerCancel={lift}
    ></div>
  );
}

export default ZoomArea;
