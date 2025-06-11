import React from "react";
import {render, screen } from "@testing-library/react";
import PuzzleResults from "../components/PuzzleResults";
import usePuzzleResults from "../components/custom_hooks/usePuzzleResults";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../routes/index"


vi.mock("../components/custom_hooks/usePuzzleResults", () => ({
  default: vi.fn(),
}))

describe("PuzzleResults", () => {
  it("renders 'Puzzle Results are loading ...' if isLoading is true", () => {
    usePuzzleResults.mockReturnValue({puzzleResults: [], puzzleTitle: null,  error: null, isLoading: true})
    render(<PuzzleResults />)

    expect(screen.getByText("Puzzle Results are loading ...")).toBeInTheDocument();
  })

  it("renders error message if sePuzzleResults returned an Error", () => {
    usePuzzleResults.mockReturnValue({puzzleResults: [], puzzleTitle: null, error: new Error("server error"), isLoading: false})

    render(<PuzzleResults />)
    expect(screen.getByText("server error")).toBeInTheDocument();
  })

})