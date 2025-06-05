class PuzzleTimer < ApplicationRecord
  belongs_to :picture_puzzle
  validates :start_time, presence: true
  validates :player_id_session, presence: true
end
