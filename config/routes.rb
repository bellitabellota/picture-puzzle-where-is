Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  namespace :api do
    namespace :v1 do
      resources :picture_puzzles, only: [ :index, :show ] do
        resources :puzzle_results, path: "results", only: [ :index, :create ]
      end

      post "puzzle_timers/:id/start_timer", to: "puzzle_timers#start_timer"
      post "puzzle_validations/:id/validate_guess", to: "puzzle_validations#validate_guess"
      get "puzzle_validations/:id/game_state", to: "puzzle_validations#game_state"
    end
  end

  # Defines the root path route ("/")
  root "homepage#index"
  get "/*path", to: "homepage#index"
end
