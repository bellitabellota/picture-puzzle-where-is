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

  it("renders error message if usePicturePuzzles returned an Error", () => {
    usePicturePuzzles.mockReturnValue({picturePuzzles: [], error: new Error("server error"), isLoading: false})

    render(<PicturePuzzles />)
    expect(screen.getByText("server error")).toBeInTheDocument();
  })
});