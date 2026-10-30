// White badge in the pill: the stitch name, or a blinking two-line warning.
function StatusBadge({ status, warning }) {
  let text = status;
  if (warning === 'selectSpeed') text = <>Please select<br />a stitch speed</>;
  if (warning === 'batteryEmpty') text = <>Battery empty<br />restart to recharge</>;

  return (
    <div className="display status-badge" aria-live="polite">
      <span className="status-text">{text}</span>
    </div>
  );
}

export default StatusBadge;
