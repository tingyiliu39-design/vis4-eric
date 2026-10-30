// ------------------------------------------------------------
// The sewing machine's state and the FAKE DEVICE.
// fakeDevice() pretends to be the Arduino: the interface sends it a command,
// it returns the machine's new state. In Week 7 this is the one piece that gets
// swapped for real messages from the hardware.
// ------------------------------------------------------------

export const BATTERY_FULL = 5;          // the level a fresh start begins with (as in the design)
export const SECONDS_PER_PERCENT = 10;  // 1% battery for every 10 s of sewing

export const SLOWEST = 1.5;   // stitches per second just above zero
export const FASTEST = 12;    // stitches per second at full speed

export const MIN_SIZE = 0.6;  // pinch limits for the stitch size
export const MAX_SIZE = 1.8;

// speed slider: the handle travels from x 248 (stopped) to x 341 (full speed)
export const SPEED_HANDLE_MIN = 248;
export const SPEED_HANDLE_TRAVEL = 93;

export const HOLD_TIME = 1000;  // ms START must be held to turn on / off (shorter = start / pause)

// the three stitch patterns, in slider order
// handleX = centre of the slider handle in design pixels (under each dot icon)
export const PATTERNS = [
  { name: 'straight', status: 'stitching', handleX: 49.75 },
  { name: 'zigzag',   status: 'hemming',   handleX: 100.75 },
  { name: 'button',   status: 'button',    handleX: 149.75 },
];

export const initialMachine = {
  isOn: false,
  stitchPattern: 'straight',
  stitchSize: 1,       // 1 = size in the design; pinch changes it
  mode: 'idle',        // "idle" (not started yet) / "running" / "paused" — short press START
  warning: null,       // "selectSpeed" / "batteryEmpty"
  speed: 0,            // 0 = stopped (hollow circle) ... 1 = fastest, stepless
  stitchesSewn: 0,     // counted up while sewing or previewing a speed
  battery: BATTERY_FULL,
  sewingSeconds: 0,    // sewing time since the last 1% drop
  patternLocked: 0,    // goes up each time a pattern change is refused (slider shakes)
};

export function statusOf(machine) {
  return PATTERNS.find((p) => p.name === machine.stitchPattern).status;
}

// really sewing: the device shakes and uses battery
export function isSewing(machine) {
  return machine.isOn && machine.mode === 'running' && machine.speed > 0;
}

// on but not started yet, speed above zero: a preview of that speed (no shake, no battery)
export function isPreviewing(machine) {
  return machine.isOn && machine.mode === 'idle' && machine.speed > 0;
}

// The fake device: (old state, command) -> new state.
// App.jsx keeps the state in useState and calls setMachine(m => fakeDevice(m, command)).
export function fakeDevice(machine, command) {
  const m = { ...machine };

  switch (command.type) {
    case 'power':
      m.isOn = !m.isOn;
      // on or off, the machine is not sewing; the slider settings are kept
      m.mode = 'idle';
      m.stitchesSewn = 0;
      m.warning = null;
      if (m.isOn) {
        // a fresh start: the (fake) battery is back to its starting level
        m.battery = BATTERY_FULL;
        m.sewingSeconds = 0;
      }
      return m;

    case 'startPause':
      // only an "on" machine can start sewing
      if (!m.isOn) return machine;
      if (m.mode === 'running') {
        m.mode = 'paused';
      } else if (m.battery <= 0) {
        m.warning = 'batteryEmpty';      // can't start: battery flat
      } else if (m.speed === 0) {
        m.warning = 'selectSpeed';       // can't start: no speed set
      } else {
        m.mode = 'running';              // start / resume sewing
        m.warning = null;
      }
      return m;

    case 'setStitchSize':
      if (!m.isOn) return machine;
      // keep the size inside the range the machine supports
      m.stitchSize = Math.min(MAX_SIZE, Math.max(MIN_SIZE, command.value));
      return m;

    case 'setSpeed':
      // the speed can be set before or after turning the machine on
      m.speed = Math.min(1, Math.max(0, command.value));
      if (m.speed > 0 && m.warning === 'selectSpeed') {
        m.warning = null;                // speed chosen: warning goes away, press START to go
      }
      if (m.speed === 0 && m.mode === 'running') {
        m.mode = 'paused';               // back on the hollow circle = stop
      } else if (m.mode === 'paused') {
        m.mode = 'idle';                 // changing speed after a pause = back to the speed preview
      }
      return m;

    case 'setPattern':
      if (command.value === m.stitchPattern) return machine;
      // the pattern can be chosen before or after turning on, but not while sewing
      if (m.mode === 'running') {
        m.patternLocked += 1;            // refused: the slider shakes "no"
        return m;
      }
      m.stitchPattern = command.value;
      m.stitchesSewn = 0;                // new pattern: start the row again
      return m;

    case 'tick': {
      // called every animation frame with the time since the last frame
      const sewing = isSewing(m);
      if (!sewing && !isPreviewing(m)) return machine;

      const stitchesPerSecond = SLOWEST + (FASTEST - SLOWEST) * m.speed;
      m.stitchesSewn += stitchesPerSecond * command.seconds;

      if (sewing) {
        // battery: 1% less for every 10 seconds of sewing
        m.sewingSeconds += command.seconds;
        if (m.sewingSeconds >= SECONDS_PER_PERCENT) {
          m.sewingSeconds -= SECONDS_PER_PERCENT;
          m.battery = Math.max(0, m.battery - 1);
          if (m.battery === 0) {
            m.mode = 'paused';           // flat battery stops the machine
            m.warning = 'batteryEmpty';
          }
        }
      }
      return m;
    }

    default:
      return machine;
  }
}
