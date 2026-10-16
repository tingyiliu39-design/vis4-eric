import { stitchShapes } from '../stitches';

// The stitch preview in the pill. Shapes use the pill's original drawing
// coordinates; PILL_TRANSFORM scales them up to the larger pill (1.10632x,
// same as the CSS on .pill).
const PILL_TRANSFORM = 'translate(-25.976 -93.674) scale(1.10632)';

const INK = '#232323';   // same as --ink in App.css
const WEIGHT = 1.3;      // marks drawn a little bolder than the original thin white lines

function StitchCanvas({ pattern, size, animating, stitchesSewn }) {
  const shapes = stitchShapes(pattern, size);

  // Sewing or previewing a speed: stitches appear one by one from left to right,
  // then the row starts again. Paused / stopped: the whole pattern is shown.
  const visible = animating ? (Math.floor(stitchesSewn) % shapes.length) + 1 : shapes.length;

  return (
    <svg className="stitch-canvas" viewBox="0 0 402 874" aria-hidden="true">
      <g transform={PILL_TRANSFORM}>
        {/* dark ink: the strongest contrast on the screen, so the eye lands here first */}
        <g fill={INK} stroke={INK} strokeLinecap="round">
          {shapes.slice(0, visible).map((s, i) =>
            s.type === 'circle'
              ? <circle key={i} cx={s.cx} cy={s.cy} r={s.r * WEIGHT} stroke="none" />
              : <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} strokeWidth={s.width * WEIGHT}
                      strokeLinecap={s.butt ? 'butt' : 'round'} />
          )}
        </g>
      </g>
    </svg>
  );
}

export default StitchCanvas;
