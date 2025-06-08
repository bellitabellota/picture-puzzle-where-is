import React, {useState, useRef, useEffect} from "react";
import { useParams } from "react-router-dom";

function RecordTimeModal({secondsToCompletion}) {
  const params = useParams();
  const [playerName, setPlayerName] = useState(null);
  const inputField = useRef();


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



    const stripHtmlEntities = (str) => {
      return String(str)
        .replace(/\n/g, "<br> <br>")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    };

    const body = {puzzle_result: {player_name: stripHtmlEntities(playerName)}}

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      },
      body: JSON.stringify(body)
    }).then((response) => {
      if(!response.ok) {
        throw new Error(`Network response was not ok - ${response.statusText}`)
      }
      return response.json();
    }).then((data)=> { 
      console.log(data)
      console.log(data.message)
      //navigate programmatically to results page
    })
    .catch((error) => {console.log(error.message)})
  }, [playerName])

  return(
    <div className="modal">
      <h2>PUZZLE FINISHED</h2>
      <p>You solved the puzzle in {minutes !== 0 && (String(minutes) + " minute(s) and ")} {remainingSeconds} seconds.</p>


      <label htmlFor="player-name">Enter your name (if you want your time to be recorded).</label>
      <input type="text" id="player-name" name="player-name" ref={inputField}/>
      <button className="record-time-btn" onClick={recordTimeHandler}>Record Time</button>

    </div>
  )
}

export default RecordTimeModal;