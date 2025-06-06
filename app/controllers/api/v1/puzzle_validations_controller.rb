class Api::V1::PuzzleValidationsController < ApplicationController
  def validate_guess
    puzzle = PicturePuzzle.find(params[:id])

    clicked_target = get_target_of_clicked_coordinates(params[:originalX], params[:originalY], puzzle.targets)

    if clicked_target && (params[:selectedName] == clicked_target["name"])
      x_center = getMedian(clicked_target["boundingBox"]["xMin"], clicked_target["boundingBox"]["xMax"])
      y_center = getMedian(clicked_target["boundingBox"]["yMin"], clicked_target["boundingBox"]["yMax"])

      render json: { success: true, message: "Target identified correctly!", target: { name: clicked_target["name"], xCenter: x_center, yCenter: y_center } }
    else
      render json: { success: false, message: "Incorrect. Try again!" }
    end
  end

  private

  def get_target_of_clicked_coordinates(originalX, originalY, target)
    target.find { |target| isInsideBoundingBox(originalX, originalY, target["boundingBox"]) }
  end

  def isInsideBoundingBox(x, y, box)
    x >= box["xMin"] && x <= box["xMax"] && y >= box["yMin"] && y <= box["yMax"]
  end

  def getMedian(min, max)
    ((min + max) / 2.0).round
  end
end
