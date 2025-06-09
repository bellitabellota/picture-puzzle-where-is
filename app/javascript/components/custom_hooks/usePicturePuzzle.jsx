import React, {useState, useEffect, use} from "react";

const usePicturePuzzle = (paramsId) => {
  const [puzzle , setPuzzle ] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    const url = `/api/v1/picture_puzzles/${paramsId}`
    
    fetch(url, {signal})
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
      if (error.name !== "AbortError") {
        setError(error);
      }
    }).finally(() => {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    })

    return () => controller.abort();

  }, [paramsId])

  return { puzzle, error, isLoading }
}

export default usePicturePuzzle;