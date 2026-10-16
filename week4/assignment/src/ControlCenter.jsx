import './ControlCenter.css'

const BUTTONS = ["-2", "-1", "Reset", "+1", "+2"];

function ControlCenter(props) {
	return (
        <div className="main-content">
            <h3>Control Center</h3>
            <div className="buttons">
                {BUTTONS.map((label) => (
                    <button key={label} onClick={() => props.onOperation(label)}>
                        {label}
                    </button>
                ))}
            </div>

            <button className="clear-button" onClick={props.onClearAll}>
                Clear History &amp; Results
            </button>
        </div>
	);
}

export default ControlCenter;
