// Battery readout: two digits, battery icon (fills with the level) and % sign.
// Drawn in the pill's own coordinates (175 x 515.5).
function BatteryReadout({ battery }) {
  // The icon is drawn 4x exaggerated (20% = full bar) so each 1% step is visible
  // at these low levels; 0% shows an empty battery.
  const levelWidth = 7.9 * Math.min(1, battery / 20);

  return (
    <svg className="display battery-readout" viewBox="0 0 175 515.5" aria-label={'Battery ' + battery + '%'}>
      <text className="battery-digits" x="37.24" y="336.42">{String(battery).padStart(2, '0')}</text>

      {/* battery icon: outline + cap + charge level */}
      <rect x="125.35" y="300.56" width="11" height="8.4" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <rect x="137.1" y="302.8" width="1.7" height="3.9" rx="0.6" fill="currentColor" />
      {battery > 0 && <rect x="126.9" y="302.1" width={levelWidth} height="5.3" rx="0.6" fill="currentColor" />}

      {/* % sign */}
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <circle cx="125.36" cy="325.22" r="2.8" />
        <circle cx="135.72" cy="332.78" r="3.1" />
        <line x1="123.7" y1="334.7" x2="137.1" y2="323" />
      </g>
    </svg>
  );
}

export default BatteryReadout;
