require "rails_helper"

RSpec.describe "PuzzleValidationsController", type: :request do
  describe "POST /api/v1/puzzle_validations/:picture_puzzle_id/validate_guess (#validate_guess)" do
    let(:session_id) { "test_session_id" }
    let(:picture_puzzle) { create(:picture_puzzle) }


    context "when validation successful and guess correct" do
      let!(:puzzle_timer) { create(:puzzle_timer, picture_puzzle: picture_puzzle, player_id_session: session_id, end_time: nil) }
      before do
        allow_any_instance_of(Api::V1::PuzzleValidationsController).to receive(:session).and_return({ player_id: session_id })
        valid_params = { originalX: 100, originalY: 130, selectedName: "Test Object 2" }
        post "/api/v1/puzzle_validations/#{picture_puzzle.id}/validate_guess", params: valid_params.to_json, headers: { 'Content-Type' => 'application/json' }
      end

      it "returns json with message 'Target identified correctly!'" do
        message = JSON.parse(response.body)["message"]
        expect(message).to eql("Target identified correctly!")
      end

      it "returns json with success is true" do
        success = JSON.parse(response.body)["success"]
        expect(success).to be(true)
      end

      it "returns json the target's name and center coordinates" do
        target = JSON.parse(response.body)["target"]
        expect(target).to eql({ "name"=>"Test Object 2", "xCenter"=>100, "yCenter"=>125 })
      end
    end

    context "when validation successful but guess NOT correct" do
      let!(:puzzle_timer) { create(:puzzle_timer, picture_puzzle: picture_puzzle, player_id_session: session_id, end_time: nil) }
      before do
        allow_any_instance_of(Api::V1::PuzzleValidationsController).to receive(:session).and_return({ player_id: session_id })
        valid_params = { originalX: 30, originalY: 130, selectedName: "Test Object 2" }
        post "/api/v1/puzzle_validations/#{picture_puzzle.id}/validate_guess", params: valid_params.to_json, headers: { 'Content-Type' => 'application/json' }
      end

      it "returns json with message 'Incorrect. Try again!'" do
        message = JSON.parse(response.body)["message"]
        expect(message).to eql("Incorrect. Try again!")
      end

      it "returns json with success is false" do
        success = JSON.parse(response.body)["success"]
        expect(success).to be(false)
      end
    end


    context "when last guess correct but identified target cannot not be saved" do
      let!(:puzzle_timer) { create(:puzzle_timer, picture_puzzle: picture_puzzle, player_id_session: session_id, end_time: nil, identified_targets: [ "Test Object 1", "Test Object 3" ]) }

      before do
        allow_any_instance_of(Api::V1::PuzzleValidationsController).to receive(:session).and_return({ player_id: session_id })
        allow(PuzzleTimer).to receive(:find_by).and_return(puzzle_timer)
        allow(puzzle_timer).to receive(:update).and_return(false)
        valid_params = { originalX: 100, originalY: 130, selectedName: "Test Object 2" }
        post "/api/v1/puzzle_validations/#{picture_puzzle.id}/validate_guess", params: valid_params.to_json, headers: { 'Content-Type' => 'application/json' }
      end

      it "returns json with error 'Failed to save identified target in puzzle timer.'" do
        error = JSON.parse(response.body)["error"]
        expect(error).to eql("Failed to save identified target in puzzle timer.")
      end
    end

    context "when all targets identified but end_time cannot not be saved" do
      let!(:puzzle_timer) { create(:puzzle_timer, picture_puzzle: picture_puzzle, player_id_session: session_id, end_time: nil, identified_targets: [ "Test Object 1", "Test Object 2", "Test Object 3" ]) }

      before do
        allow_any_instance_of(Api::V1::PuzzleValidationsController).to receive(:session).and_return({ player_id: session_id })
        allow(PuzzleTimer).to receive(:find_by).and_return(puzzle_timer)
        allow(puzzle_timer).to receive(:update).and_return(false)
        valid_params = { originalX: 100, originalY: 130, selectedName: "Test Object 2" }
        post "/api/v1/puzzle_validations/#{picture_puzzle.id}/validate_guess", params: valid_params.to_json, headers: { 'Content-Type' => 'application/json' }
      end

      it "returns json with error 'Failed to save end time in puzzle timer.'" do
        error = JSON.parse(response.body)["error"]
        expect(error).to eql("Failed to save end time in puzzle timer.")
      end
    end




    # when correct guess could not be saved
    #   { error: "Failed to save identified target in puzzle timer." }, status: :unprocessable_entity
    # when end time could not be saved upon completion of the game

    # when validation successful and guess correct
    #   returns json with { success: true, message: "Target identified correctly!", target: { name: clicked_target["name"], xCenter: x_center, yCenter: y_center } }

    # when validation successful but guess incorrect
    #   returns json with { success: false, message: "Incorrect. Try again!" }
  end
end
