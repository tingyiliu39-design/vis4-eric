import { useRef, useState } from 'react';
import { PATTERNS } from '../machine';

// dot icon for each pattern, above the slider (screen coordinates)
const DOTS = {
  straight: [[39.25, 156.25], [60.25, 156.25]],
  zigzag:   [[97.25, 148.25], [111.25, 148.25], [90.25, 163.25], [104.25, 163.25]],
  button:   [[142.25, 149.25], [157.25, 149.25], [142.25, 163.25], [157.25, 163.25]],
};

const LABELS = { straight: 'Straight stitch', zigzag: 'Zigzag stitch (hemming)', button: 'Button stitch' };

// Stitch pattern card: tap a column or drag along the slider;
// the handle snaps to the nearest pattern.
function PatternCard({ pattern, lockedCount, toDesignX, onSelect }) {
  const dragging = useRef(false);

  // "locked" feedback: short shake when a change is refused while sewing.
  // lockedCount goes up on every refusal; the slider shakes until it has
  // "caught up" (one shake at a time, so dragging doesn't restart it).
  const [shakenCount, setShakenCount] = useState(0);
  const shaking = lockedCount > shakenCount;

  function patternAt(event) {
    const x = toDesignX(event.clientX);
    let nearest = PATTERNS[0];
    for (const p of PATTERNS) {
      if (Math.abs(p.handleX - x) < Math.abs(nearest.handleX - x)) nearest = p;
    }
    return nearest.name;
  }

  return (
    <section className="card card-pattern">
      <h2 className="card-label label-pattern">Stitch Pattern</h2>

      {/* SVG circles keep every dot the same size at any screen scale */}
      <svg className="options" viewBox="0 0 402 874" aria-hidden="true">
        {PATTERNS.map((p) => DOTS[p.name].map(([cx, cy]) => (
          <circle key={cx + '-' + cy} cx={cx} cy={cy} r="2.5" />
        )))}
      </svg>

      <div
        className={'slider slider-pattern' + (shaking ? ' is-locked' : '')}
        onAnimationEnd={() => setShakenCount(lockedCount)}
      >
        <div className="slider-handle handle-pattern"></div>
      </div>

      {/* invisible tap targets: one column per pattern (dots + slider) */}
      <div
        className="pattern-picker"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          onSelect(patternAt(e));
        }}
        onPointerMove={(e) => {
          if (dragging.current) onSelect(patternAt(e));
        }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}
      >
        {PATTERNS.map((p) => (
          <button
            key={p.name}
            type="button"
            className={'pattern-option option-' + p.name}
            aria-label={LABELS[p.name]}
            aria-pressed={pattern === p.name}
            onClick={() => onSelect(p.name)}
          ></button>
        ))}
      </div>
    </section>
  );
}

export default PatternCard;
