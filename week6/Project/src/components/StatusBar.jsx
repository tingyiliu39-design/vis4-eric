// iPhone 17 status bar mock-up: time, front camera (Dynamic Island), signal, Wi-Fi, battery.
// Drawn in design pixels (402 x 62). Hidden on a real phone (see the check in index.html).
function StatusBar() {
  return (
    <svg className="ios-status-bar" viewBox="0 0 402 62" aria-hidden="true">
      <text className="ios-time" x="76" y="35.5" textAnchor="middle">9:41</text>

      {/* Dynamic Island with the front camera */}
      <rect x="138.5" y="11" width="125" height="37" rx="18.5" fill="#000" />
      <circle cx="244.5" cy="29.5" r="5.5" fill="#0b0b12" />
      <circle cx="244.5" cy="29.5" r="2.6" fill="#141a2a" />
      <circle cx="243.4" cy="28.4" r="0.8" fill="#2c3550" />

      {/* cellular signal: 4 bars */}
      <g fill="#111">
        <rect x="290" y="31" width="3" height="4" rx="0.8" />
        <rect x="294.5" y="29" width="3" height="6" rx="0.8" />
        <rect x="299" y="26.5" width="3" height="8.5" rx="0.8" />
        <rect x="303.5" y="24" width="3" height="11" rx="0.8" />
      </g>

      {/* Wi-Fi: dot + two arcs */}
      <g fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round">
        <path d="M 311.6 28.3 A 9 9 0 0 1 324.4 28.3" />
        <path d="M 314.3 31 A 5.2 5.2 0 0 1 321.7 31" />
      </g>
      <circle cx="318" cy="34" r="1.6" fill="#111" />

      {/* battery: outline, charge level, cap */}
      <rect x="331.5" y="23.5" width="24" height="12" rx="3.6" fill="none" stroke="#111" strokeOpacity="0.4" />
      <rect x="333.5" y="25.5" width="20" height="8" rx="2" fill="#111" />
      <path d="M 357 27.5 a 1.6 2 0 0 1 0 4 z" fill="#111" fillOpacity="0.4" />
    </svg>
  );
}

export default StatusBar;
