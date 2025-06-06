import React from "react";

function RecordTimeModal({secondsToCompletion}) {
  return(
    <div className="modal">
      <h2>PUZZLE FINISHED</h2>
      <p>You solved the puzzle in {secondsToCompletion} seconds.</p>


        <label for="player-name">Enter your name (if you want your time to be recorded).</label>
        <input type="text" id="player-name" name="playerName"/>
        <button className="record-time-btn">Record Time</button>

    </div>
  )
}

export default RecordTimeModal