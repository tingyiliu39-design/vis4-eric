import { useEffect, useRef, useState } from 'react';
import { fakeDevice, initialMachine, isPreviewing, isSewing, statusOf } from './machine';

import StatusBar from './components/StatusBar';
import PatternCard from './components/PatternCard';
import SpeedCard from './components/SpeedCard';
import StatusBadge from './components/StatusBadge';
import BatteryReadout from './components/BatteryReadout';
import StartButton from './components/StartButton';
import StitchCanvas from './components/StitchCanvas';
import ZoomArea from './components/ZoomArea';

function App() {
  // all machine state lives in useState; every change goes through fakeDevice()
  const [machine, setMachine] = useState(initialMachine);
  const screen = useRef(null);   // the screen element, only used to measure it

  // send a command to the (fake) device: new state = fakeDevice(old state, command)
  function send(command) {
    setMachine((current) => fakeDevice(current, command));
  }

  const sewing = isSewing(machine);
  const previewing = isPreviewing(machine);

  // the fake device "runs" every animation frame while sewing or previewing a speed
  useEffect(() => {
    if (!sewing && !previewing) return;
    let last = null;
    let frame;
    function run(now) {
      if (last !== null) {
        const seconds = (now - last) / 1000;
        setMachine((current) => fakeDevice(current, { type: 'tick', seconds }));
      }
      last = now;
      frame = requestAnimationFrame(run);
    }
    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [sewing, previewing]);

  // finger position -> design pixels (the 402-wide screen may be scaled)
  function toDesignX(clientX) {
    const box = screen.current.getBoundingClientRect();
    return (clientX - box.left) / (box.width / 402);
  }

  const classes = ['screen'];
  if (machine.isOn) classes.push('is-on');
  if (sewing) classes.push('is-running');                     // the device shakes
  if (machine.isOn && machine.warning) classes.push('show-warning');
  if (machine.warning) classes.push('two-line-warning');

  return (
    <main
      ref={screen}
      className={classes.join(' ')}
      data-pattern={machine.stitchPattern}
      style={{
        '--speed': machine.speed,
        '--shake-time': (0.12 - 0.07 * machine.speed).toFixed(3) + 's',
      }}
    >
      <StatusBar />

      <h1 className="title">Handheld Sewing Machine</h1>

      <PatternCard
        pattern={machine.stitchPattern}
        lockedCount={machine.patternLocked}
        toDesignX={toDesignX}
        onSelect={(name) => send({ type: 'setPattern', value: name })}
      />

      <SpeedCard
        speed={machine.speed}
        toDesignX={toDesignX}
        onChange={(value) => send({ type: 'setSpeed', value })}
      />

      <section className="card card-main">
        <div className="pill">
          <StatusBadge status={statusOf(machine)} warning={machine.warning} />
          <BatteryReadout battery={machine.battery} />
          <StartButton
            isOn={machine.isOn}
            isRunning={machine.mode === 'running'}
            onLongPress={() => send({ type: 'power' })}
            onShortPress={() => send({ type: 'startPause' })}
          />
        </div>
      </section>

      <StitchCanvas
        pattern={machine.stitchPattern}
        size={machine.stitchSize}
        animating={sewing || previewing}
        stitchesSewn={machine.stitchesSewn}
      />

      <ZoomArea
        size={machine.stitchSize}
        onResize={(value) => send({ type: 'setStitchSize', value })}
      />
    </main>
  );
}

export default App;
