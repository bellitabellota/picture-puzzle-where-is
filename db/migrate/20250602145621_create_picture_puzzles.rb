class CreatePicturePuzzles < ActiveRecord::Migration[7.2]
  def change
    create_table :picture_puzzles do |t|
      t.string :title
      t.string :image_src
      t.text :task_description
      t.integer :resolution_width
      t.integer :resolution_height
      t.jsonb :targets

      t.timestamps
    end
    add_index :picture_puzzles, :title, unique: true
  end
end
