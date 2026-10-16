import './Sidebar.css'

function Sidebar(props) {
	return (
        <div className="sidebar">
            <h3>Result</h3>
            <p id="resultId">{props.total}</p>
            <p id="totalMessage">{props.message}</p>

            <div id="summary">
                Total additions: {props.additions}, <br /> Total subtractions: {props.subtractions}
            </div>

            <h3>History</h3>
            <p className="hint">Click an item to remove it</p>
            <ul id="historyList">
                {props.history.map((item, index) => (
                    <li key={index} onClick={() => props.onRemove(index)}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
	);
}

export default Sidebar;
