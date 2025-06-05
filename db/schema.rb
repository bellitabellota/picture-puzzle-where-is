# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_06_05_110812) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "picture_puzzles", force: :cascade do |t|
    t.string "title"
    t.string "image_src"
    t.text "task_description"
    t.integer "resolution_width"
    t.integer "resolution_height"
    t.jsonb "targets"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["title"], name: "index_picture_puzzles_on_title", unique: true
  end

  create_table "puzzle_timers", force: :cascade do |t|
    t.datetime "start_time"
    t.datetime "end_time"
    t.string "player_id_session"
    t.bigint "picture_puzzle_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["picture_puzzle_id"], name: "index_puzzle_timers_on_picture_puzzle_id"
  end

  add_foreign_key "puzzle_timers", "picture_puzzles"
end
