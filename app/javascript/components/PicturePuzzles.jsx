import React from "react";
import { Link } from "react-router-dom";
import usePicturePuzzles from "./custom_hooks/usePicturePuzzles";

function PicturePuzzles() {
  const {picturePuzzles, error, isLoading} = usePicturePuzzles();

  if(isLoading) return <p>Puzzles are loading ...</p>
  if(error) return <p>{error.message}</p>;

  const puzzles = picturePuzzles.map((picturePuzzle) => <Link to={`/${picturePuzzle.id}`} key={picturePuzzle.id}>{picturePuzzle.title}<br></br></Link>)

  return(
    <main>
      <h1>Choose a Puzzle</h1>
      {puzzles}
    </main>
  )
}

export default PicturePuzzles;