import {useEffect, useState} from "react";

const usePuzzleResults = (paramsId) => {
  const [puzzleResults, setPuzzleResults] = useState([]);
  const [puzzleTitle, setPuzzleTitle] = useState(null);

  useEffect(() => {
    const url =`/api/v1/picture_puzzles/${paramsId}/results`;
    fetch(url)
    .then((response) => {
      if(!response.ok) {
        throw new Error("Network response not ok")
      }
      return response.json()
    }).then((data) => {
      setPuzzleTitle(data.puzzleTitle);
      setPuzzleResults(data.results);
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  return {puzzleResults, puzzleTitle}

}

export default usePuzzleResults;