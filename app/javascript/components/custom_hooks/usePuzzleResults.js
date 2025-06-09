import {useEffect, useState} from "react";

const usePuzzleResults = (paramsId) => {
  const [puzzleResults, setPuzzleResults] = useState([]);
  const [puzzleTitle, setPuzzleTitle] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const url =`/api/v1/picture_puzzles/${paramsId}/results`;
    fetch(url, {signal})
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

    return () => controller.abort(); // the cleanup function was added because the effect runs when the component mounts. So in case the component unmount before the request completes, the request would have been still active but the component would not be there anymore to handle the response.
  }, [])

  return {puzzleResults, puzzleTitle}

}

export default usePuzzleResults;