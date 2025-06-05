class Api::V1::PicturePuzzlesController < ApplicationController
  before_action :set_player_id

  def index
    @puzzles = PicturePuzzle.all
    render json: @puzzles
  end

  def show
    @puzzle = PicturePuzzle.find(params[:id])
    render json: @puzzle
  end

  private

  def set_player_id
    session[:player_id] = session[:player_id] || SecureRandom.uuid
  end
end
