require "rails_helper"

RSpec.describe "PuzzleResultsController", type: :request do
  describe "GET '/api/v1/picture_puzzles/:picture_puzzle_id/results' (#index)" do
    before do
      picture_puzzle_1 = create(:picture_puzzle)
      picture_puzzle_2 = create(:picture_puzzle, title: "Test Puzzle 2")

      3.times do
        create(:puzzle_result, picture_puzzle: picture_puzzle_1)
      end

      4.times do
        create(:puzzle_result, picture_puzzle: picture_puzzle_2)
      end

      get "/api/v1/picture_puzzles/#{picture_puzzle_2.id}/results"
    end

    it "renders the response as json" do
      expect(response.content_type).to eq("application/json; charset=utf-8")
    end

    it "returns the puzzle title" do
      puzzle_title = JSON.parse(response.body)["puzzleTitle"]
      expect(puzzle_title).to eql("Test Puzzle 2")
    end

    it "returns all corresponding results" do
      number_returned_results = JSON.parse(response.body)["results"].length
      expect(number_returned_results).to be(4)
    end

    it "returns the status code 200" do
      expect(response).to have_http_status(:success)
    end
  end
end
