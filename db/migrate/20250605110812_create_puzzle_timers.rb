class CreatePuzzleTimers < ActiveRecord::Migration[7.2]
  def change
    create_table :puzzle_timers do |t|
      t.datetime :start_time
      t.datetime :end_time
      t.string :player_id_session
      t.references :picture_puzzle, null: false, foreign_key: true

      t.timestamps
    end
  end
end
