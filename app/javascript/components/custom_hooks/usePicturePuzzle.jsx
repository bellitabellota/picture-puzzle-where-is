import React, {useState, useEffect, use} from "react";

const usePicturePuzzle = (paramsId) => {
  const [puzzle , setPuzzle ] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url = `/api/v1/picture_puzzles/${paramsId}`
    
    fetch(url)
    .then((response) => {
      if(!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((response) => {
      setPuzzle({...response,
        imageSrc: response.image_src,
        taskDescription: response.task_description
      });
    }).catch((error) => {
      setError(error)
    }).finally(() => {
      setIsLoading(false)
    })
  }, [paramsId])

  return { puzzle, error, isLoading }
}

export default usePicturePuzzle;