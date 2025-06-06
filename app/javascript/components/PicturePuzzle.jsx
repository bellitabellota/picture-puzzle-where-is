import React, {useRef, useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import IncorrectMessage from "./PicturePuzzleChildComponents/IncorrectMessage";
import SelectBoxContainer from "./PicturePuzzleChildComponents/SelectBoxContainer";
import CheckMark from "./PicturePuzzleChildComponents/CheckMark";
import Timer from "./PicturePuzzleChildComponents/Timer";
import RecordTimeModal from "./PicturePuzzleChildComponents/RecordTimeModal";

function PicturePuzzle() {
  const params = useParams();
  const [puzzle , setPuzzle ] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [secondsToCompletion, setSecondsToCompletion] = useState(null);
  const [secondsPassed, setSecondsPassed] = useState(0);

  const [clickedCoordinates, setClickedCoordinates] = useState({ });
  const [selectedName, setSelectedName] = useState(null);
  const [correctlyIdentifiedTargets, setCorrectlyIdentifiedTargets] = useState([]);
  const [incorrectMessage, setIncorrectMessage] = useState(null);
  const selectBox = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const url = `/api/v1/picture_puzzles/${params.id}`
    
    fetch(url)
    .then((response) => {
      if(!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((response) => {
      setPuzzle({...response,
        imageSrc: response.image_src,
        taskDescription: response.task_description
      });
    }).catch((error) => {
      setError(error)
    }).finally(() => {
      setIsLoading(false)
    })
  }, [params.id])

  useEffect(()=> {
    if(puzzle ) {
      const url = `/api/v1/puzzle_timers/${params.id}/start_timer`;
      const token = document.querySelector('meta[name="csrf-token"]').content;

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": token
        }
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok - ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => console.log("Start Timer:", data))
      .catch((error) => console.log("Error Start Timer:", error.message));
    }
  }, [puzzle])

  function getCoordinates(event) {
    const img = event.target;
    const rect = img.getBoundingClientRect();

    const displayedWidth = rect.width;
    const displayedHeight = rect.height;

    const scalingFactorX = displayedWidth / puzzle.resolution_width;
    const scalingFactorY = displayedHeight / puzzle.resolution_height;

    // Calculate relative click position
    const scaledX = event.clientX - rect.left;
    const scaledY = event.clientY - rect.top;

    // Scale click coordinates back to original resolution
    const originalX = Math.round(scaledX / scalingFactorX);
    const originalY = Math.round(scaledY / scalingFactorY);

    setClickedCoordinates({originalX:originalX, originalY: originalY, scaledX: scaledX, scaledY:scaledY, isSelecting: true})
  }

  function selectName() {
    const selectedTargetName = selectBox.current.value;
    setSelectedName(selectedTargetName);

    // Ensure that the select box is removed from screen (until next click on image) 
    setClickedCoordinates({...clickedCoordinates, isSelecting: false})
  }

  useEffect(()=>{
    if (!selectedName) return; 
    if(selectedName) {
      const url = `/api/v1/puzzle-validations/${params.id}/validate-guess`
      const token = document.querySelector('meta[name="csrf-token"]').content;
      const body = {originalX: clickedCoordinates.originalX, originalY: clickedCoordinates.originalY, selectedName}

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": token
        },
        body: JSON.stringify(body),
      }).then((response) => {
        if(!response.ok) {
          throw new Error(`Network response was not ok - ${response.statusText}`);
        }
        return response.json()
      }).then((data) => {

        if (data.success === true && !correctlyIdentifiedTargets.includes(data.target)) {
          setCorrectlyIdentifiedTargets([...correctlyIdentifiedTargets, data.target]);
        } else {
          setIncorrectMessage(data.message);
        }

        setSelectedName(null);
      }).catch(error=> console.log("Error Puzzle Validation:", error.message))
    }
  }, [selectedName])

  useEffect(() => {
    if (puzzle && (correctlyIdentifiedTargets.length === puzzle.targets.length)) {
      const url = `/api/v1/puzzle-validations/${params.id}/game-state`
      const token = document.querySelector('meta[name="csrf-token"]').content;

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": token
        },
      }).then((response) => {
        if(!response.ok) {
          throw new Error(`Network response was not ok - ${response.statusText}`);
        }
        return response.json()
      }).then((data) => {
        if (data.gameFinished === true) {
          setSecondsToCompletion(data.secondsToCompletion);
          console.log(data.secondsToCompletion)
        }
      }).catch(error => console.log("Error Puzzle Validation Game status:", error.message))
    }
  }, [correctlyIdentifiedTargets])

  const savedIncreaseSecondsPassed = useRef();

  function increaseSecondsPassed() {
    setSecondsPassed(secondsPassed + 1);
  }

  useEffect(()=> {
    // saving the increaseSecond function on every render via useRef 
    // makes sure that when the function is passed into setInterval in the Effect below 
    // always the most recent state of secondsPassed is referenced
    savedIncreaseSecondsPassed.current = increaseSecondsPassed;
  })

  useEffect(()=>{
    let id;
    if (secondsToCompletion) {
      return () => {};
    }

    if (puzzle) {
      id = setInterval(() => {savedIncreaseSecondsPassed.current()},  1000)
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    }
  }, [puzzle, secondsToCompletion])


  if(isLoading) return <p>Puzzle is loading ...</p>
  if(error) return <p>{error.message}</p>;

  return (
    <main className="main-picture-puzzle">
      {incorrectMessage && <IncorrectMessage message={incorrectMessage} setIncorrectMessage={setIncorrectMessage} />}
      <Link to="/" >&lt; Back to Home</Link>
      <h1>{puzzle.title}</h1>
      <div className="task-info">
        <p>{puzzle.taskDescription}</p>
        <Timer seconds={secondsToCompletion ? secondsToCompletion : secondsPassed}/>
      </div>

      <div className="img-container">
        {clickedCoordinates.isSelecting && 
          <SelectBoxContainer clickedCoordinates={clickedCoordinates} selectBox={selectBox} targets={puzzle.targets} selectName={selectName} />
        }

        { (correctlyIdentifiedTargets.length !== 0) &&
          <CheckMark identifiedTargets={correctlyIdentifiedTargets} imgRef={imgRef} resolution={[puzzle.resolution_width, puzzle.resolution_height]} />
        }

        { secondsToCompletion !== null && 
          <RecordTimeModal secondsToCompletion={secondsToCompletion} />
        }
        <img src={puzzle.imageSrc} onClick={getCoordinates} ref={imgRef}/>
      </div>
    </main>
  )
}

export default PicturePuzzle;