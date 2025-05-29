import PicturePuzzles from "../components/PicturePuzzles";
import PicturePuzzle from "../components/PicturePuzzle"
import React from "react";

const routes = [{
  path: "/",
  element: <PicturePuzzles />
}, {
  path: "/:id",
  element: <PicturePuzzle />
}]

export default routes;