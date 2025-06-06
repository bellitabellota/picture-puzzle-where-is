class AddIdentifiedTargetsToPuzzleTimers < ActiveRecord::Migration[7.2]
  def change
    add_column :puzzle_timers, :identified_targets, :jsonb, default: []
  end
end
