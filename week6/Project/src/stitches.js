// ------------------------------------------------------------
// Stitch geometry for the preview in the pill.
// Numbers are design pixels measured from the PDFs; "size" is the pinch size.
// Every function returns a list of shapes in sewing order (left to right).
// ------------------------------------------------------------

// one zigzag = two strokes "/" and "\"
// period = 1.604 h, each stroke leans 0.512 h, gap between strokes 0.29 h
function zigzagPeriod(x, cy, h, width) {
  const top = cy - h / 2;
  const bottom = cy + h / 2;
  const lean = 0.512 * h;
  const gap = 0.29 * h;
  return [
    { type: 'line', x1: x, y1: bottom, x2: x + lean, y2: top, width },
    { type: 'line', x1: x + lean + gap, y1: top, x2: x + 2 * lean + gap, y2: bottom, width },
  ];
}

// as many whole zigzags as fit in maxWidth, centred on cx
function zigzagCentred(cx, cy, h, width, maxWidth) {
  const period = 1.604 * h;
  const oneZig = 1.314 * h;   // width of a single "/\"
  const count = Math.max(1, Math.floor((maxWidth - oneZig) / period + 0.001) + 1);
  const total = (count - 1) * period + oneZig;
  let strokes = [];
  for (let i = 0; i < count; i++) {
    strokes = strokes.concat(zigzagPeriod(cx - total / 2 + i * period, cy, h, width));
  }
  return strokes;
}

// as many whole dashes as fit in maxWidth, centred on cx
function dashes(cx, cy, length, step, width, maxWidth) {
  const count = Math.max(1, Math.floor((maxWidth - length) / step + 0.001) + 1);
  const total = (count - 1) * step + length;
  const list = [];
  for (let i = 0; i < count; i++) {
    const x = cx - total / 2 + i * step;
    list.push({ type: 'line', x1: x, y1: cy, x2: x + length, y2: cy, width, butt: true });
  }
  return list;
}

// 2 x 2 dots, top-left → top-right → bottom-left → bottom-right
function fourDots(cx, cy, half, r) {
  const offsets = [[-half, -half], [half, -half], [-half, half], [half, half]];
  return offsets.map(([dx, dy]) => ({ type: 'circle', cx: cx + dx, cy: cy + dy, r }));
}

export function stitchShapes(pattern, size) {
  if (pattern === 'straight') {
    // row of dashes, centred at x 206.5, y 414.7
    return dashes(206.5, 414.7, 17.4 * size, 21.96 * size, 1.5 * size, 128);
  }
  if (pattern === 'zigzag') {
    // whole zigzags centred on x 206.35; the bottom stays at y 425.27
    // so a bigger stitch grows upwards, away from the status badge
    const h = 11.53 * size;
    return zigzagCentred(206.35, 425.27 - h / 2, h, 1.3 * size, 132);
  }
  // button
  return fourDots(206.73, 414.13, 3.95 * size, 1.4 * size);
}
