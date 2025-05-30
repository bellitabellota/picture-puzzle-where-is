import React from "react";
import { Link } from "react-router-dom";

//This object serves as model, latter the data will be retrieved from the database with only querying the required information (id, title, image source?)
const picturePuzzles = [{
  id: 1,
  title: "The Smurfs",
  imageSrc: "XXX.png",
  coordinatesTargets: [],
  taskDescription: "Find Papa Smurf, Smurfette and Brainy Smurf."
}, {
  id: 2,
  title: "Forest Life",
  imageSrc: "XXX.png",
  coordinatesTargets: [],
  taskDescription: "Find all Ladybugs."
}, {
  id: 3,
  title: "Ocean World",
  imageSrc: "XXX.png",
  coordinatesTargets: [],
  taskDescription: "Find all Hammerhead sharks."
}]

function PicturePuzzles() {
  const puzzles = picturePuzzles.map((picturePuzzle) => <Link to={`/${picturePuzzle.id}`} key={picturePuzzle.id}>{picturePuzzle.title}<br></br></Link>)
  return(
    <main>
      <h1>Choose a Puzzle</h1>
      {puzzles}
    </main>
  )
}

export default PicturePuzzles;