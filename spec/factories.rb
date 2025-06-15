FactoryBot.define do
  factory :picture_puzzle do
    title { "Test Puzzle 1" }
    image_src { "/picture-puzzle-images/test-puzzle-1.jpg" }
    task_description { "Find object 1 and 2." }
    resolution_width { 1000 }
    resolution_height { 674 }
    targets { [
      { name: "Test Object 1", boundingBox: { xMin: 50, xMax: 40, yMin: 80, yMax: 50 } },
      { name: "Test Object 2", boundingBox: { xMin: 110, xMax: 90, yMin: 140, yMax: 110 } },
      { name: "Test Object 3", boundingBox: { xMin: 150, xMax: 170, yMin: 160, yMax: 200 } }
    ] }
  end

  factory :puzzle_result do
    name { Faker::Name.first_name }
    seconds_to_completion { 127 }
    association :picture_puzzle, factory: :picture_puzzle
  end

  factory :puzzle_timer do
    start_time { "2025-06-15 13:30:39.504725000 +0000" }
    end_time { "2025-06-14 13:57:35.456780000 +0000" }
    player_id_session { "e4e48d20-20e3-4da2-90d2-b804f704c733" }
    association :picture_puzzle, factory: :picture_puzzle
    identified_targets { [ "Test Object 3" ] }
  end
end
