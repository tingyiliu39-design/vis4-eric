import { useState } from 'react'
import './App.css'

import Header from './Header';
import Sidebar from './Sidebar';
import ControlCenter from './ControlCenter';

// how much each operation changes the total ("Reset" is handled separately)
const OPERATIONS = {
  "-2": -2,
  "-1": -1,
  "+1": 1,
  "+2": 2,
};

function App() {
  // history is the ONLY state. total and the counts are worked out from it
  // on every render, so removing an item updates everything automatically.
  const [history, setHistory] = useState([]);

  let total = 0;
  let additions = 0;
  let subtractions = 0;

  for (let i = 0; i < history.length; i++) {
    const operation = history[i];

    if (operation === "Reset") {
      total = 0;
    } else {
      const change = OPERATIONS[operation];
      total = total + change;

      if (change > 0) {
        additions = additions + 1;
      } else {
        subtractions = subtractions + 1;
      }
    }
  }

  // conditional message (was checkTotal() in week 3)
  let message;
  if (total > 0) {
    message = "The total is positive.";
  } else if (total < 0) {
    message = "The total is negative.";
  } else {
    message = "The total is zero.";
  }

  // a button was clicked: add it to the history
  function handleOperation(operation) {
    setHistory([...history, operation]);
  }

  // Clear History & Results
  function clearAll() {
    setHistory([]);
  }

  // click a history item to remove it (bonus: total + counts update too)
  function removeHistoryItem(index) {
    setHistory(history.filter((item, i) => i !== index));
  }

  return (
    <>
      <Header />
      <div className="container">
        <Sidebar
          total={total}
          message={message}
          additions={additions}
          subtractions={subtractions}
          history={history}
          onRemove={removeHistoryItem}
        />
        <ControlCenter
          onOperation={handleOperation}
          onClearAll={clearAll}
        />
      </div>
    </>
  )
}

export default App
