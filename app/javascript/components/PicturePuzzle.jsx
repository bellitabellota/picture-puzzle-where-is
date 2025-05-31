import React, {useRef, useState} from "react";
import { Link } from "react-router-dom";

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
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [clickedCoordinates, setClickedCoordinates] = useState({ });
  console.log(`selectedTarget:${selectedTarget}`);
  console.log(`clickedCoordinates:${clickedCoordinates.originalX} and ${clickedCoordinates.originalY}`);

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

  function checkIfTargetIdentified(originalX, originalY) {
    puzzle.targets.forEach((target) => {
      if (isInsideBoundingBox(originalX, originalY, target.boundingBox)) {
        console.log(`You found ${target.name }!`);
      }
    })
  }

  function isInsideBoundingBox(x, y, box) {
    return x >= box.xMin && x <= box.xMax && y >= box.yMin && y <= box.yMax;
  }

  const selectBox = useRef(null);

  function confirmTargetSelection() {
    setSelectedTarget(selectBox.current.value);
  }

  const targetOptions = puzzle.targets.map((target) => <option value={target.name} key={target.name}>{target.name}</option>)

  return (
    <main className="main-picture-puzzle">
      <Link to="/" >&lt; Back to Home</Link>
      <h1>{puzzle.title}</h1>
      <div className="task-info">
        <p>{puzzle.taskDescription}</p>
        <Timer />
      </div>

      <div className="img-container">
        {clickedCoordinates.isSelecting && (
          <div className="select-box-container" style={{
            position: "absolute",
            top: `${clickedCoordinates.scaledY}px`,
            left: `${clickedCoordinates.scaledX}px`
          }}>
            <select name="selected-target" id="selected-target" ref={selectBox}>
              {targetOptions}
            </select>
            <button onClick={confirmTargetSelection}>OK</button>
          </div>
        )}
        
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
