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
end
