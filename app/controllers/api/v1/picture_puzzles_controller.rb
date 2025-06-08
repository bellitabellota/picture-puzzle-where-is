class Api::V1::PicturePuzzlesController < ApplicationController
  before_action :set_player_id

  def index
    puzzles = PicturePuzzle.all
    filtered_puzzles = puzzles.map { |puzzle| puzzle.as_json(only: [ :id, :title, :image_src ]) }
    render json: filtered_puzzles
  end

  def show
    puzzle = PicturePuzzle.find(params[:id])

    filtered_puzzle = puzzle.as_json
    filtered_puzzle["targets"].each { |target| target.delete("boundingBox") }

    render json: filtered_puzzle
  end

  private

  def set_player_id
    session[:player_id] = session[:player_id] || SecureRandom.uuid
  end
end
