import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";

function PuzzleResults() {
  const params = useParams();
  const [puzzleResults, setPuzzleResults] = useState([]);
  const [puzzleTitle, setPuzzleTitle] = useState(null);
  
  console.log(`puzzleResults ${puzzleResults}`)
  console.log(puzzleTitle)
  console.log(puzzleResults[0])

  useEffect(() => {
    const url =`/api/v1/picture_puzzles/${params.id}/results`;

    fetch(url)
    .then((response) => {
      if(!response.ok) {
        throw new Error("Network response not ok")
      }
      return response.json()
    }).then((data) => {
      console.log(data)
      setPuzzleTitle(data.title)
      setPuzzleResults(data.results);
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  return (
    <p>{params.id}</p>
  )
}

export default PuzzleResults;