class PuzzleResult < ApplicationRecord
  belongs_to :picture_puzzle

  validates :name, presence: :true, length: { maximum: 40 }
  validates :seconds_to_completion, presence: :true
end
