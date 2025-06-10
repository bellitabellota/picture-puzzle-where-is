class Api::V1::PuzzleValidationsController < ApplicationController
  def validate_guess
    puzzle = PicturePuzzle.find(params[:id])
    puzzle_timer = PuzzleTimer.find_by(picture_puzzle_id: params[:id], player_id_session: session[:player_id])

    clicked_target = get_target_of_clicked_coordinates(params[:originalX], params[:originalY], puzzle.targets)

    if clicked_target && (params[:selectedName] == clicked_target["name"])

      unless puzzle_timer.identified_targets.include?(clicked_target["name"])
        target_saved = puzzle_timer.update(identified_targets: puzzle_timer.identified_targets.push(clicked_target["name"]))

        unless target_saved
          return render json: { error: "Failed to save identified target in puzzle timer." }, status: :unprocessable_entity
        end
      end

      if puzzle_timer.identified_targets.sort == puzzle.targets.map { |target| target["name"] }.sort

        end_time_saved = puzzle_timer.update(end_time: Time.current)

        unless end_time_saved
          return render json: { error: "Failed to save end time in puzzle timer." }, status: :unprocessable_entity
        end
      end

      x_center = getMedian(clicked_target["boundingBox"]["xMin"], clicked_target["boundingBox"]["xMax"])
      y_center = getMedian(clicked_target["boundingBox"]["yMin"], clicked_target["boundingBox"]["yMax"])

      render json: { success: true, message: "Target identified correctly!", target: { name: clicked_target["name"], xCenter: x_center, yCenter: y_center } }
    else
      render json: { success: false, message: "Incorrect. Try again!" }
    end
  end

  def game_state
    puzzle_timer = PuzzleTimer.find_by(picture_puzzle_id: params[:id], player_id_session: session[:player_id])

    if puzzle_timer.end_time
      seconds_to_completion = (puzzle_timer.end_time - puzzle_timer.start_time).floor
      render json: { gameFinished: true, secondsToCompletion: seconds_to_completion }
    else
      render json: { gameFinished: false }
    end
  end

  private

  def get_target_of_clicked_coordinates(originalX, originalY, targets)
    targets.find { |target| isInsideBoundingBox(originalX, originalY, target["boundingBox"]) }
  end

  def isInsideBoundingBox(x, y, box)
    x >= box["xMin"] && x <= box["xMax"] && y >= box["yMin"] && y <= box["yMax"]
  end

  def getMedian(min, max)
    ((min + max) / 2.0).round
  end
end
