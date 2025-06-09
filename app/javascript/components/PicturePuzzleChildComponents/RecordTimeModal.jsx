import React, {useState, useRef, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";

function RecordTimeModal({secondsToCompletion}) {
  const params = useParams();
  const [playerName, setPlayerName] = useState(null);
  const [saveResultsError, setSaveResultsError] = useState(null);
  const inputField = useRef();
  const navigate = useNavigate();

  const minutes = Math.floor(secondsToCompletion / 60);
  const remainingSeconds = secondsToCompletion % 60;

  function recordTimeHandler() {
    if (inputField.current.value === "") {
      return alert("Enter a name to record your time.")
    }

    setPlayerName(inputField.current.value);
  }

  useEffect(() => {
    if(!playerName) return;
    const url = `/api/v1/picture_puzzles/${params.id}/results`;
    const token = document.querySelector('meta[name="csrf-token').content

    const body = {puzzle_result: {player_name: playerName}}

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      },
      body: JSON.stringify(body)
    }).then((response) => {
      if(!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`)
      }
      return response.json();
    }).then((data)=> { 
      navigate(`/${params.id}/results`);
    })
    .catch((error) => {setSaveResultsError(error)})
  }, [playerName, navigate])

  const pageHtml = saveResultsError ? 
    <div className="modal"><p>{saveResultsError.message} - The puzzle result could not be saved.</p></div> 
    : 
    (<div className="modal">
      <h2>PUZZLE FINISHED</h2>
      <p>You solved the puzzle in {minutes !== 0 && (String(minutes) + " minute(s) and ")} {remainingSeconds} seconds.</p>

      <label htmlFor="player-name">Enter your name (if you want your time to be recorded).</label>
      <input type="text" id="player-name" name="player-name" ref={inputField}/>
      <button className="record-time-btn" onClick={recordTimeHandler}>Record Time</button>
    </div>)

  return(
    pageHtml
  )
}

export default RecordTimeModal;