class PicturePuzzle < ApplicationRecord
  has_many :puzzle_timers, dependent: :destroy
  has_many :puzzle_results, dependent: :destroy

  validates :title, presence: true, uniqueness: true
  validates :image_src, presence: true
  validates :task_description, presence: true
  validates :resolution_height, presence: true
  validates :resolution_width, presence: true
  validates :targets, presence: true
end
