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

  describe "POST '/api/v1/picture_puzzles/:picture_puzzle_id/results' (#create)" do
    let(:session_id) { "test_session_id" }
    let(:picture_puzzle) { create(:picture_puzzle) }
    let!(:puzzle_timer) { create(:puzzle_timer, picture_puzzle: picture_puzzle, player_id_session: session_id) }

    before do
      allow_any_instance_of(Api::V1::PuzzleResultsController).to receive(:session).and_return({ player_id: session_id })
    end

    context "when result could be persisted" do
      before do
        valid_params  = { puzzle_result: { player_name: "Player Name To Persist" }  }
        post "/api/v1/picture_puzzles/#{picture_puzzle.id}/results", params: valid_params.to_json, headers: { 'Content-Type' => 'application/json' }
      end

      it "returns a json with the message 'Puzzle result successfully saved.'" do
        message = JSON.parse(response.body)["message"]
        expect(message).to eql("Puzzle result successfully saved.")
      end

      it "returns the status code 200" do
        expect(response).to have_http_status(:success)
      end
    end

    context "when result could NOT be persisted" do
      before do
        invalid_params  = { puzzle_result: { player_name: "Player Name too long so it makes the Model Validation fail." }  }
        post "/api/v1/picture_puzzles/#{picture_puzzle.id}/results", params: invalid_params.to_json, headers: { 'Content-Type' => 'application/json' }
      end

      it "returns a json with the error'Puzzle result could not be saved.'" do
        error = JSON.parse(response.body)["error"]
        expect(error).to eql("Puzzle result could not be saved.")
      end

      it "returns the status code 422" do
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
