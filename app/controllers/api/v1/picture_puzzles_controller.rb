class Api::V1::PicturePuzzlesController < ApplicationController
  def index
    @puzzles = PicturePuzzle.all
    render json: @puzzles
  end

  def show
    @puzzle = PicturePuzzle.find(params[:id])
    render json: @puzzle
  end
end
