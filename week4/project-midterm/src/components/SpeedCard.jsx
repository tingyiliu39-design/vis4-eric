import { useRef } from 'react';
import { SPEED_HANDLE_MIN, SPEED_HANDLE_TRAVEL } from '../machine';

// speed dots: [x, radius], all on y 156.5 (screen coordinates)
const DOTS = [
  [262.5, 0.5], [269, 1], [276, 1], [283.5, 1.5], [292, 2],
  [301, 2], [311.5, 2.5], [322, 3], [334, 4], [348.5, 4.5],
];

// Speed card: drag along the slider. Far left (hollow circle) = stopped,
// further right = faster (stepless). Works before and after turning on.
function SpeedCard({ speed, toDesignX, onChange }) {
  const dragging = useRef(false);
  const handleCentre = SPEED_HANDLE_MIN + 5.5 + SPEED_HANDLE_TRAVEL * speed;

  function speedAt(event) {
    // the handle is 11 wide, so its left edge sits 5.5 left of the finger
    let s = (toDesignX(event.clientX) - 5.5 - SPEED_HANDLE_MIN) / SPEED_HANDLE_TRAVEL;
    if (s < 0.03) s = 0;   // easy to park it on "stopped"
    return Math.min(1, s);
  }

  function onKeyDown(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') onChange(speed + 0.05);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') onChange(speed - 0.05 < 0.03 ? 0 : speed - 0.05);
    else if (event.key === 'Home') onChange(0);
    else if (event.key === 'End') onChange(1);
    else return;
    event.preventDefault();
  }

  return (
    <section className="card card-speed">
      <h2 className="card-label label-speed">Speed</h2>

      <svg className="options" viewBox="0 0 402 874" aria-hidden="true">
        {/* dots up to the handle are drawn dark, the rest light grey */}
        <circle className={'dot-off' + (speed === 0 ? ' is-active' : '')} cx="252.5" cy="156.5" r="4.375" />
        {DOTS.map(([cx, r]) => (
          <circle key={cx} cx={cx} cy="156.5" r={r}
                  className={speed > 0 && cx <= handleCentre + 2 ? 'is-active' : undefined} />
        ))}
      </svg>

      <div className="slider slider-speed">
        <div className="slider-handle handle-speed"></div>
      </div>

      {/* invisible drag area over the speed dots + slider */}
      <div
        className="speed-picker"
        role="slider"
        tabIndex={0}
        aria-label="Speed"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(speed * 100)}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          onChange(speedAt(e));
        }}
        onPointerMove={(e) => {
          if (dragging.current) onChange(speedAt(e));
        }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}
        onKeyDown={onKeyDown}
      ></div>
    </section>
  );
}

export default SpeedCard;
