import React, {useEffect, useState} from "react";
import { useParams, Link } from "react-router-dom";

function PuzzleResults() {
  const params = useParams();
  const [puzzleResults, setPuzzleResults] = useState([]);
  const [puzzleTitle, setPuzzleTitle] = useState(null);

  useEffect(() => {
    const url =`/api/v1/picture_puzzles/${params.id}/results`;
    fetch(url)
    .then((response) => {
      if(!response.ok) {
        throw new Error("Network response not ok")
      }
      return response.json()
    }).then((data) => {console.log(data.puzzleTitle)

      setPuzzleTitle(data.puzzleTitle);
      setPuzzleResults(data.results);
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  const resultElements = puzzleResults.map((result, index) => {
    const minutes = Math.floor(result.seconds_to_completion/ 60);
    const remainingSeconds = result.seconds_to_completion % 60;

    return(
      <div key={result.id}>
        <p className="rank">{index + 1}</p>
        <p className="name">{result.name}</p>
        <p className="duration">{`${minutes} m ${remainingSeconds} s `}</p>

      </div>
    )
  })

  return (
    <main className="main-picture-puzzle-results">

    <Link to="/" >&lt; Back to Home</Link>
    <h1>{puzzleTitle} - Results</h1>

    <div className="results-container">
      <div className="label-container">
        <p className="rank-label">Rank</p>
        <p className="name-label">Name</p>
        <p className="duration-label">Duration</p>
      </div>
      { resultElements }
    </div>
  </main>
  )
}

export default PuzzleResults;