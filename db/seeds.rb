# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puzzle = PicturePuzzle.find_or_initialize_by(title: "The Smurfs")

puzzle.assign_attributes(
  image_src: "/picture-puzzle-images/the-smurfs.jpg",
  task_description: "Find Papa Smurf, Smurfette and Brainy Smurf.",
  resolution_width: 1000,
  resolution_height: 674,
  targets: [
    { name: "Smurfette", boundingBox: { xMin: 90, xMax: 140, yMin: 360, yMax: 440 } },
    { name: "Papa Smurf", boundingBox: { xMin: 410, xMax: 475, yMin: 420, yMax: 507 } },
    { name: "Brainy Smurf", boundingBox: { xMin: 277, xMax: 343, yMin: 525, yMax: 655 } }
  ]
)

puzzle.save!
