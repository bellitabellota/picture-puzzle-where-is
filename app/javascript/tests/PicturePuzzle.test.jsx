import PicturePuzzle from "../components/PicturePuzzle";
import usePicturePuzzle from "../components/custom_hooks/usePicturePuzzle";
import {render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../routes/index"
import useValidateGuess from "../components/custom_hooks/useValidateGuess";
import useGameState from "../components/custom_hooks/useGameState";
import useStartTimer from "../components/custom_hooks/useStartTimer";
import usePuzzleFrontendTimer from "../components/custom_hooks/usePuzzleFrontendTimer";

vi.mock("../components/custom_hooks/usePicturePuzzle", () => ({ default: vi.fn() }))
vi.mock("../components/custom_hooks/useValidateGuess", () => ({ default: vi.fn() }))
vi.mock("../components/custom_hooks/useGameState", () => ({ default: vi.fn() }))
vi.mock("../components/custom_hooks/useStartTimer", () => ({ default: vi.fn() }))
vi.mock("../components/custom_hooks/usePuzzleFrontendTimer", () => ({ default: vi.fn() }))

const testPuzzle = {
  id: 123,
  title: "Fun Test Puzzle",
  imageSrc: "/picture-puzzle-images/test-puzzle.jpg",
  taskDescription: "Find all Test Targets.",
  resolution_width: 1280,
  resolution_height: 720,
  targets: [
      { name: "Test Target 1" },
      { name: "Test Target 2" },
      { name: "Test Target 3" }
  ]
}

const memoryRouter = createMemoryRouter(routes, { initialEntries: ["/123"] })

describe("PicturePuzzle", ()=> {
  it("renders 'Puzzle is loading ...' when isLoading is true", () => {
    usePicturePuzzle.mockReturnValue({puzzle: null, error: null, isLoading: true})
    useValidateGuess.mockReturnValue({ correctlyIdentifiedTargets: [], validationError: null });
    useGameState.mockReturnValue({ secondsToCompletion: null, gameStateError: null })
    useStartTimer.mockReturnValue({ startTimerError: null });

    usePuzzleFrontendTimer.mockReturnValue({ secondsPassed: 0 });

    render(<PicturePuzzle />)

    expect(screen.getByText("Puzzle is loading ...")).toBeInTheDocument();
  })

  it("renders error message if usePicturePuzzle returned an Error", () => {
    usePicturePuzzle.mockReturnValue({puzzle: null, error: new Error("server error"), isLoading: false})
    useValidateGuess.mockReturnValue({ correctlyIdentifiedTargets: [], validationError: null });
    useGameState.mockReturnValue({ secondsToCompletion: null, gameStateError: null })
    useStartTimer.mockReturnValue({ startTimerError: null });

    usePuzzleFrontendTimer.mockReturnValue({ secondsPassed: 0 });

    render(<PicturePuzzle />)
    expect(screen.getByText("server error")).toBeInTheDocument();
  })

  it("renders error message if useStartTimer returned an Error", () => {
    usePicturePuzzle.mockReturnValue({puzzle: null, error: null, isLoading: false})
    useValidateGuess.mockReturnValue({ correctlyIdentifiedTargets: [], validationError: null });
    useGameState.mockReturnValue({ secondsToCompletion: null, gameStateError: null })
    useStartTimer.mockReturnValue({ startTimerError: new Error("useStartTimer error") });

    usePuzzleFrontendTimer.mockReturnValue({ secondsPassed: 0 });

    render(<PicturePuzzle />)
    expect(screen.getByText("useStartTimer error - The server could not correctly set the start time.")).toBeInTheDocument();
  })

  it("renders puzzle if usePicturePuzzle returned a puzzle", ()=> {
    usePicturePuzzle.mockReturnValue({ puzzle: testPuzzle, error: false, isLoading: false})
    useValidateGuess.mockReturnValue({ correctlyIdentifiedTargets: [], validationError: null });
    useGameState.mockReturnValue({ secondsToCompletion: null, gameStateError: null })
    useStartTimer.mockReturnValue({ startTimerError: null });

    usePuzzleFrontendTimer.mockReturnValue({ secondsPassed: 0 });

    const {container} = render(
      <RouterProvider router={memoryRouter}></RouterProvider>
    )

    expect(container).toMatchSnapshot();
  })

  it('shows the target selection box when image is clicked', () => {
    usePicturePuzzle.mockReturnValue({ puzzle: testPuzzle, error: false, isLoading: false})
    useValidateGuess.mockReturnValue({ correctlyIdentifiedTargets: [], validationError: null });
    useGameState.mockReturnValue({ secondsToCompletion: null, gameStateError: null })
    useStartTimer.mockReturnValue({ startTimerError: null });
    usePuzzleFrontendTimer.mockReturnValue({ secondsPassed: 0 });
  
    render(
      <RouterProvider router={memoryRouter}></RouterProvider>
    )
    
    const img = screen.getByRole('img');
    fireEvent.click(img, { clientX: 100, clientY: 100 });
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays check mark when target is correctly identified', () => {
    usePicturePuzzle.mockReturnValue({ puzzle: testPuzzle, error: false, isLoading: false})
    useValidateGuess.mockReturnValue({ correctlyIdentifiedTargets: [{ name: "Identified Test Target", xCenter: 100, yCenter: 61 }], validationError: null });
    useGameState.mockReturnValue({ secondsToCompletion: null, gameStateError: null })
    useStartTimer.mockReturnValue({ startTimerError: null });
    usePuzzleFrontendTimer.mockReturnValue({ secondsPassed: 0 });
    
    render(
      <RouterProvider router={memoryRouter}></RouterProvider>
    );
    
    const checkMarks = screen.getAllByRole('img', { name: '' });
    const checkMark = checkMarks.find(img => img.className.includes('check-mark'));
    
    expect(checkMark).toBeInTheDocument();
  })

  it('shows completion modal when puzzle is completed', () => {
    usePicturePuzzle.mockReturnValue({ puzzle: testPuzzle, error: false, isLoading: false})
    useValidateGuess.mockReturnValue({ correctlyIdentifiedTargets: [], validationError: null });
    useGameState.mockReturnValue({ secondsToCompletion: 91, gameStateError: null })
    useStartTimer.mockReturnValue({ startTimerError: null });
    usePuzzleFrontendTimer.mockReturnValue({ secondsPassed: 0 });
    
    render(
      <RouterProvider router={memoryRouter}></RouterProvider>
    );
    
    expect(screen.getByText("You solved the puzzle in 1 minute(s) and 31 seconds.")).toBeInTheDocument();
  })
});