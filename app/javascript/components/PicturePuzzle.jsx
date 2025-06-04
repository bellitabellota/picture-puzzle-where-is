import React, {useRef, useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import IncorrectMessage from "./PicturePuzzleChildComponents/IncorrectMessage";
import SelectBoxContainer from "./PicturePuzzleChildComponents/SelectBoxContainer";
import CheckMark from "./PicturePuzzleChildComponents/CheckMark";
import Timer from "./PicturePuzzleChildComponents/Timer";

function PicturePuzzle() {
  const params = useParams();
  const [puzzle , setPuzzle ] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [clickedCoordinates, setClickedCoordinates] = useState({ });
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

  if(isLoading) return <p>Puzzle is loading ...</p>
  if(error) return <p>{error.message}</p>;

  if (correctlyIdentifiedTargets.length === puzzle.targets.length) {
    const correctlyIdentifiedTargetsSorted = correctlyIdentifiedTargets.map((target) => JSON.stringify(target)).sort();
    const puzzleTargetsSorted = puzzle.targets.map((target) => JSON.stringify(target)).sort();

    if (correctlyIdentifiedTargetsSorted.every((value, index) => value === puzzleTargetsSorted[index])) {
      alert("You found all targets");
    } 
  }

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

        { (correctlyIdentifiedTargets.length !== 0) &&
          <CheckMark identifiedTargets={correctlyIdentifiedTargets} imgRef={imgRef} resolution={[puzzle.resolution_width, puzzle.resolution_height]} />
        }
        
        <img src={puzzle.imageSrc} onClick={getCoordinates} ref={imgRef}/>
      </div>
    </main>
  )
}

export default PicturePuzzle;