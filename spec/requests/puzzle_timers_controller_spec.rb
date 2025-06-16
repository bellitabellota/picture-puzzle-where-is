require "rails_helper"

RSpec.describe "PuzzleTimersController", type: :request do
  let(:session_id) { "test_session_id" }
  let(:picture_puzzle) { create(:picture_puzzle) }

  before do
    allow_any_instance_of(Api::V1::PuzzleTimersController).to receive(:session).and_return({ player_id: session_id })
    post "/api/v1/puzzle_timers/#{picture_puzzle.id}/start_timer"
  end

  describe "post '/api/v1/puzzle_timers/:picture_puzzle:id/start_timer' (#start_timer)" do
    it "renders the response as json" do
      expect(response.content_type).to eq("application/json; charset=utf-8")
    end

    context "when timer is successfully started" do
      it "returns json with the message 'Timer started'" do
        message = JSON.parse(response.body)["message"]
        expect(message).to eql("Timer started")
      end

      it "returns the status code 200" do
        expect(response).to have_http_status(:success)
      end
    end

    context "when timer fails to start" do
      before do
        allow_any_instance_of(PuzzleTimer).to receive(:update).and_return(false)
        post "/api/v1/puzzle_timers/#{picture_puzzle.id}/start_timer"
      end

      it "returns json with the error 'Failed to start timer'" do
        message = JSON.parse(response.body)["error"]
        expect(message).to eql("Failed to start timer")
      end

      it "returns the status code 422" do
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
