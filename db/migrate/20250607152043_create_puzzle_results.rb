class CreatePuzzleResults < ActiveRecord::Migration[7.2]
  def change
    create_table :puzzle_results do |t|
      t.string :name
      t.integer :seconds_to_completion
      t.references :picture_puzzle, null: false, foreign_key: true

      t.timestamps
    end
  end
end
