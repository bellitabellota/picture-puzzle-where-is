import React from "react";
import { Link } from "react-router-dom";

//The puzzle will be retrieved from the database or passed in in the parent as prop?

const puzzle = {
  id: 1,
  title: "The Smurfs",
  imageSrc: "/picture-puzzle-images/the-smurfs.jpg",
  coordinatesTargets: [],
  taskDescription: "Find Papa Smurf, Smurfette and Brainy Smurf."
}

function PicturePuzzle() {
  return (
    <main className="main-picture-puzzle">
      <Link to="/" >&lt; Back to Home</Link>
      <h1>{puzzle.title}</h1>
      <div className="task-info">
        <p>{puzzle.taskDescription}</p>
        <Timer />
      </div>
      <img src={puzzle.imageSrc} />
    </main>
  )
}

export default PicturePuzzle;


function Timer() {
  return(
    <p className="timer">00:00</p>
  )
}
