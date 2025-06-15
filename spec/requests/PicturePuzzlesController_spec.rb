require "rails_helper"

RSpec.describe "PicturePuzzlesController", type: :request do
  before do
    create(:picture_puzzle)
    create(
      :picture_puzzle,
      title: "Test Puzzle 2",
      image_src: "/picture-puzzle-images/test-puzzle-1.jpg"
    )
    create(
      :picture_puzzle,
      title: "Test Puzzle 3",
      image_src: "/picture-puzzle-images/test-puzzle-3.jpg"
    )

    get "/api/v1/picture_puzzles"
  end

  describe "GET /picture_puzzles (#index)" do
    it "renders the response as json" do
      expect(response.content_type).to eq("application/json; charset=utf-8")
    end

    it "returns all puzzles" do
      number_returned_puzzles = JSON.parse(response.body).length
      expect(number_returned_puzzles).to be(3)
    end

    it "returns the status code 200" do
      expect(response).to have_http_status(:success)
    end
  end
end
