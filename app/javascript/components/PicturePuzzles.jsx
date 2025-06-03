import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

function PicturePuzzles() {
  const [picturePuzzles , setPicturePuzzles ] = useState([]);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const url = "/api/v1/picture_puzzles"
    
    fetch(url)
    .then((response) => {
      if(!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((response) => {
      setPicturePuzzles(response);
    }).catch(() => {
      setError(error)
    })
  }, [])

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