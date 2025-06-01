import React, {useRef, useState} from "react";
import { Link } from "react-router-dom";
import IncorrectMessage from "./IncorrectMessage";
import SelectBoxContainer from "./SelectBoxContainer";

//The puzzle will be retrieved from the database or passed in in the parent as prop?

const puzzle = {
  id: 1,
  title: "The Smurfs",
  imageSrc: "/picture-puzzle-images/the-smurfs.jpg",
  taskDescription: "Find Papa Smurf, Smurfette and Brainy Smurf.",
  resolution: [1000, 674],
  targets: [
    { name: "Smurfette", boundingBox: { xMin: 90, xMax: 140, yMin: 360, yMax: 440 }},
    { name: "Papa Smurf", boundingBox: { xMin: 410, xMax: 475, yMin: 420, yMax: 507 }}, 
    { name: "Brainy Smurf", boundingBox: { xMin: 277, xMax: 343, yMin: 525, yMax: 655}}
  ]
}

function PicturePuzzle() {
  const [clickedCoordinates, setClickedCoordinates] = useState({ });
  const [correctlyIdentifiedTargets, setCorrectlyIdentifiedTargets] = useState([]);
  const [incorrectMessage, setIncorrectMessage] = useState(null);

  // Finish and call the below placeCorrectSymbols function
  function placeCorrectSymbols(correctlyIdentifiedTargets) {

  }

  //Call function that checks if correctlyIdentifiedTargets matches targets to see if puzzle completed.

  function getCoordinates(event) {
    const img = event.target;
    const rect = img.getBoundingClientRect();

    const displayedWidth = rect.width;
    const displayedHeight = rect.height;

    const scalingFactorX = displayedWidth / puzzle.resolution[0];
    const scalingFactorY = displayedHeight / puzzle.resolution[1];

    // Calculate relative click position
    const scaledX = event.clientX - rect.left;
    const scaledY = event.clientY - rect.top;

    // Scale click coordinates back to original resolution
    const originalX = Math.round(scaledX / scalingFactorX);
    const originalY = Math.round(scaledY / scalingFactorY);

    setClickedCoordinates({originalX:originalX, originalY: originalY, scaledX: scaledX, scaledY:scaledY, isSelecting: true})
  }

  function getTargetOfClickedCoordinates(originalX, originalY) {
    let clickedTarget = null;

    puzzle.targets.forEach((target) => {
      if (isInsideBoundingBox(originalX, originalY, target.boundingBox)) {
        clickedTarget = target;
      }
    })
    return clickedTarget;
  }

  function isInsideBoundingBox(x, y, box) {
    return x >= box.xMin && x <= box.xMax && y >= box.yMin && y <= box.yMax;
  }

  const selectBox = useRef(null);

  function confirmTargetSelection() {
    const selectedTargetName = selectBox.current.value;
    const clickedTarget = getTargetOfClickedCoordinates(clickedCoordinates.originalX, clickedCoordinates.originalY);

    if (clickedTarget && (selectedTargetName === clickedTarget.name)) {
      if (!correctlyIdentifiedTargets.includes(clickedTarget)) {
        // Add to correctlyIdentifiedTargets state variable
        setCorrectlyIdentifiedTargets([...correctlyIdentifiedTargets, clickedTarget]);
      } else {
        setIncorrectMessage("Already identified. Find the remaining targets.")
      }

    } else {
      setIncorrectMessage("Not quite. Try it again.")
    }

    // Ensure that the select box is removed from screen (until next click on image) 
    setClickedCoordinates({...clickedCoordinates, isSelecting: false})
  }

  return (
    <main className="main-picture-puzzle">
      {incorrectMessage && <IncorrectMessage message={incorrectMessage} setIncorrectMessage={setIncorrectMessage} />}
      <Link to="/" >&lt; Back to Home</Link>
      <h1>{puzzle.title}</h1>
      <div className="task-info">
        <p>{puzzle.taskDescription}</p>
        <Timer />
      </div>

      <div className="img-container">
        {clickedCoordinates.isSelecting && 
          <SelectBoxContainer clickedCoordinates={clickedCoordinates} selectBox={selectBox} targets={puzzle.targets} confirmTargetSelection={confirmTargetSelection} />
        }
        
        <img src={puzzle.imageSrc} onClick={getCoordinates} />
      </div>
    </main>
  )
}

export default PicturePuzzle;

function Timer() {
  return(
    <p className="timer">00:00</p>
  )
}
