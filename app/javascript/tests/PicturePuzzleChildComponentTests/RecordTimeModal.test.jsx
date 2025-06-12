import React from "react";
import {fireEvent, render, screen, waitFor } from "@testing-library/react";
import RecordTimeModal from "../../components/PicturePuzzleChildComponents/RecordTimeModal";
import { createMemoryRouter, RouterProvider } from "react-router-dom";


describe("RecordTimeModal", ()=> {
  const router = createMemoryRouter(
    [{
      path: "/",
      element: <RecordTimeModal secondsToCompletion={30} />,
    }]
  );

  it("displays the formatted seconds when time under 1 minute", ()=> {
    render(<RouterProvider router={router} />)
    expect(screen.getByText("You solved the puzzle in 30 seconds.")).toBeInTheDocument();
  })

  it("displays the formatted minutes and seconds when time over 1 minute", ()=> {
    const routerOverOneMinute = createMemoryRouter(
      [{
        path: "/",
        element: <RecordTimeModal secondsToCompletion={90} />,
      }]
    );

    render(<RouterProvider router={routerOverOneMinute} />)

    expect(screen.getByText("You solved the puzzle in 1 minute(s) and 30 seconds.")).toBeInTheDocument();
  })

  it("displays an alert when submitting empty input field", ()=>{
    const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<RouterProvider router={router} />)
    const button = screen.getByText("Record Time");
    fireEvent.click(button);
    expect(mockAlert).toHaveBeenCalledWith("Enter a name to record your time.");
    mockAlert.mockRestore();
  })

  it("clicking 'Record  time' with name in input field submits a post request with the name", async ()=>{

    window.fetch = vi.fn(() => Promise.resolve());

    render(<RouterProvider router={router} />);
    
    document.head.innerHTML = `<meta name="csrf-token" content="test-csrf-token" />`;
    const input = screen.getByLabelText(/Enter your name/);
    fireEvent.change(input, { target: { value: "Test Player" } });
    fireEvent.click(screen.getByText("Record Time"));

    await waitFor(() => {
      expect(fetch.mock.calls[0][1].method).toBe("POST");
      expect(fetch.mock.calls[0][1].body).toBe('{"puzzle_result":{"player_name":"Test Player"}}');
    });
  });

  it("displays an error message when post request failed", async()=>{
    window.fetch = vi.fn(() => Promise.resolve({
      json: () => Promise.resolve({ error: "Test error" }),
    }));

    render(<RouterProvider router={router} />);
    
    document.head.innerHTML = `<meta name="csrf-token" content="test-csrf-token" />`;
    const input = screen.getByLabelText(/Enter your name/);
    fireEvent.change(input, { target: { value: "Test Player" } });
    fireEvent.click(screen.getByText("Record Time"));

    await waitFor(() => {
      expect(screen.getByText(/Test error - The puzzle result could not be saved./)).toBeInTheDocument();
    });
  })

  /* Successful programmatic navigation to PuzzleResults will be checked in integration test*/
})