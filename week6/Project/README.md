# Handheld Sewing Machine — React version (Week 6)

Week 6 update of the Week 4 midterm interface (`week4/project-midterm` is left unchanged):

- Main interface follows the new vertical layout: status badge, battery and START read top to bottom.
- `useState` for everything that changes: the machine state in `App.jsx`, the START hold
  (pressed look + 1-second timer), slider dragging and the pinch gesture.

## Run it

```bash
npm install      # first time only
npm run dev      # then open http://localhost:5173
```

`npm run build` makes a finished site in `dist/` (it works from any folder).

## How it is organised

| File | What it does |
|---|---|
| `src/machine.js` | All machine state and `fakeDevice()` — (old state, command) → new state; stands in for the Arduino (swap for real messages in Week 7) |
| `src/stitches.js` | Geometry of the straight / zigzag / button stitches |
| `src/App.jsx` | Holds the state (`useState`), runs the fake device every animation frame, puts the components together |
| `src/components/StatusBar.jsx` | iPhone status bar mock-up (hidden on a real phone) |
| `src/components/PatternCard.jsx` | Stitch pattern slider (locked with a shake while sewing) |
| `src/components/SpeedCard.jsx` | Stepless speed slider |
| `src/components/StartButton.jsx` | Hold 1 s = on/off, short press = start/pause |
| `src/components/StatusBadge.jsx` | Stitch name / blinking warnings |
| `src/components/BatteryReadout.jsx` | Battery digits, icon and % |
| `src/components/StitchCanvas.jsx` | Animated stitch preview |
| `src/components/ZoomArea.jsx` | Pinch / wheel to resize the stitch |
| `src/App.css` | Styles (soft white / grey look, all sizes in design pixels) |
| `src/assets/` | Fonts (regular, light, thin and semibold weights) |
