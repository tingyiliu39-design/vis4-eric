import { useRef } from 'react';
import { HOLD_TIME } from '../machine';

// START button:
//  hold 1 second = turn on / off      (onLongPress)
//  short press   = start / pause      (onShortPress)
function StartButton({ isOn, isRunning, onLongPress, onShortPress }) {
  const timer = useRef(null);
  const pressing = useRef(false);
  const button = useRef(null);

  function setHolding(on) {
    button.current.classList.toggle('is-holding', on);
  }

  function press(event) {
    event.preventDefault();
    pressing.current = true;
    setHolding(true);
    timer.current = setTimeout(() => {
      // held long enough: power on / off
      timer.current = null;
      pressing.current = false;
      setHolding(false);
      onLongPress();
    }, HOLD_TIME);
  }

  function release() {
    if (!pressing.current) return;   // the long press already fired
    pressing.current = false;
    setHolding(false);
    clearTimeout(timer.current);
    onShortPress();                  // released before 1 second: short press
  }

  function cancel() {
    // finger slid off the button: do nothing
    pressing.current = false;
    setHolding(false);
    clearTimeout(timer.current);
  }

  let label = 'Hold to turn on';
  if (isOn) label = isRunning ? 'Tap to pause, hold to turn off' : 'Tap to start, hold to turn off';

  return (
    <button
      ref={button}
      className="start-button"
      type="button"
      aria-label={label}
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) press(e); }}
      onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') release(); }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="start-label">Start</span>
    </button>
  );
}

export default StartButton;
