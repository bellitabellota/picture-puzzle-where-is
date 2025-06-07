import React from "react";

function RecordTimeModal({secondsToCompletion}) {
  const minutes = Math.floor(secondsToCompletion / 60);
  const remainingSeconds = secondsToCompletion % 60;

  return(
    <div className="modal">
      <h2>PUZZLE FINISHED</h2>
      <p>You solved the puzzle in {minutes !== 0 && (String(minutes) + "minute(s) and ")} {remainingSeconds} seconds.</p>


        <label for="player-name">Enter your name (if you want your time to be recorded).</label>
        <input type="text" id="player-name" name="playerName"/>
        <button className="record-time-btn">Record Time</button>

    </div>
  )
}

export default RecordTimeModal