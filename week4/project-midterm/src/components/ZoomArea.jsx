import { useEffect, useRef } from 'react';

// Invisible pinch area over the stitch preview.
// Two fingers: spread = bigger stitch, pinch = smaller.
// On a computer: trackpad pinch or mouse wheel over the preview.
function ZoomArea({ size, onResize }) {
  const area = useRef(null);
  const fingers = useRef(new Map());   // pointerId -> {x, y}
  const pinch = useRef({ distance: 0, size: 1 });
  const latest = useRef({ size, onResize });
  useEffect(() => {
    latest.current = { size, onResize };   // newest values for the wheel/gesture listeners
  });

  function distance() {
    const p = Array.from(fingers.current.values());
    return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
  }

  // wheel and Safari gesture events need non-passive listeners, so add them here
  useEffect(() => {
    const el = area.current;
    let gestureStart = 1;
    function onWheel(e) {
      e.preventDefault();
      const speed = e.ctrlKey ? 0.01 : 0.004;   // ctrlKey = trackpad pinch
      latest.current.onResize(latest.current.size * Math.exp(-e.deltaY * speed));
    }
    function onGestureStart(e) { e.preventDefault(); gestureStart = latest.current.size; }
    function onGestureChange(e) { e.preventDefault(); latest.current.onResize(gestureStart * e.scale); }
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('gesturestart', onGestureStart);
    el.addEventListener('gesturechange', onGestureChange);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('gesturestart', onGestureStart);
      el.removeEventListener('gesturechange', onGestureChange);
    };
  }, []);

  function lift(e) {
    fingers.current.delete(e.pointerId);
    pinch.current.distance = 0;
  }

  return (
    <div
      ref={area}
      className="zoom-area"
      aria-label="Pinch to change stitch size"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        fingers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (fingers.current.size === 2) pinch.current = { distance: distance(), size };
      }}
      onPointerMove={(e) => {
        if (!fingers.current.has(e.pointerId)) return;
        fingers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (fingers.current.size === 2 && pinch.current.distance > 0) {
          onResize(pinch.current.size * distance() / pinch.current.distance);
        }
      }}
      onPointerUp={lift}
      onPointerCancel={lift}
    ></div>
  );
}

export default ZoomArea;
