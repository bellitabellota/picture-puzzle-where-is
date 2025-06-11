import React from "react";
import { Link } from "react-router-dom";
import usePicturePuzzles from "./custom_hooks/usePicturePuzzles";

function PicturePuzzles() {
  const {picturePuzzles, error, isLoading} = usePicturePuzzles();
  

  if(isLoading) return <p>Puzzles are loading ...</p>
  if(error) return <p>{error.message}</p>;
  console.log(picturePuzzles[0])

  const puzzles = picturePuzzles.map((picturePuzzle) => 
    <Link to={`/${picturePuzzle.id}`} >
      <div className="picture-puzzle" key={picturePuzzle.id}>
        <div className="image-container">
          <img src={picturePuzzle.image_src} className="puzzle-image" />
        </div>
        <p className="puzzle-title">{picturePuzzle.title}</p>
      </div>
    </Link>
  )

  return(
    <main className="main-picture-puzzles">
      <h1>Choose A Puzzle</h1>
      <div className="grid-container">
        {puzzles}
      </div>
    </main>
  )
}

export default PicturePuzzles;