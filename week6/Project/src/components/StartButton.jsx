import { useState } from 'react';
import { HOLD_TIME } from '../machine';

// START button:
//  hold 1 second = turn on / off      (onLongPress)
//  short press   = start / pause      (onShortPress)
function StartButton({ isOn, isRunning, onLongPress, onShortPress }) {
  const [holding, setHolding] = useState(false);   // finger is down (face looks pressed)
  const [timer, setTimer] = useState(null);         // the running 1-second hold timer

  function press(event) {
    event.preventDefault();
    setHolding(true);
    setTimer(setTimeout(() => {
      // held long enough: power on / off
      setTimer(null);
      setHolding(false);
      onLongPress();
    }, HOLD_TIME));
  }

  function release() {
    if (!holding) return;            // the long press already fired
    setHolding(false);
    clearTimeout(timer);
    setTimer(null);
    onShortPress();                  // released before 1 second: short press
  }

  function cancel() {
    // finger slid off the button: do nothing
    setHolding(false);
    clearTimeout(timer);
    setTimer(null);
  }

  let label = 'Hold to turn on';
  if (isOn) label = isRunning ? 'Tap to pause, hold to turn off' : 'Tap to start, hold to turn off';

  return (
    <button
      className={'start-button' + (holding ? ' is-holding' : '')}
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
