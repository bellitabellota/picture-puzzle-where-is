import React, {useState, useEffect} from "react";

const usePicturePuzzles = () => {
  const [picturePuzzles , setPicturePuzzles ] = useState([]);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const url = "/api/v1/picture_puzzles"
    
    fetch(url, {signal})
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

    return () => controller.abort();
    
  }, [])

  return { picturePuzzles, error }
}

export default usePicturePuzzles;