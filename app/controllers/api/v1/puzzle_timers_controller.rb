class Api::V1::PuzzleTimersController < ApplicationController
  def start_timer
    puzzle_timer = PuzzleTimer.find_or_create_by(
      picture_puzzle_id: params[:id],
      player_id_session: session[:player_id]
    )

    if puzzle_timer.update(start_time: Time.current) # Time.current gets the UTC time
      render json: { message: "Timer started", start_time: puzzle_timer.start_time }, status: :ok
    else
      render json: { error: "Failed to start timer" }, status: :unprocessable_entity
    end
  end

  def end_timer
    puzzle_timer = PuzzleTimer.find_by(
      picture_puzzle_id: params[:id],
      player_id_session: session[:player_id]
    )

    puzzle_timer.update(end_time: Time.current)
  end
end
