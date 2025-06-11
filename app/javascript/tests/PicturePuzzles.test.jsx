import PicturePuzzles from "../components/PicturePuzzles";
import usePicturePuzzles from "../components/custom_hooks/usePicturePuzzles";
import {render, screen } from "@testing-library/react";
import React from "react";

vi.mock("../components/custom_hooks/usePicturePuzzles", () => ({
  default: vi.fn()
}))

describe("PicturePuzzles", ()=> {
  it("renders 'Puzzles are loading ...' when isLoading is true", () => {
    usePicturePuzzles.mockReturnValue({picturePuzzles: [], error: null, isLoading: true})
    const {container} = render(<PicturePuzzles />)

    expect(container).toMatchSnapshot();
  })
});