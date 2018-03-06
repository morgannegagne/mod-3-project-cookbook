Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :recipes, only: [:index, :show, :create, :destroy]
  resources :recipe_ingredients, only: [:create]
  resources :ingredients, only: [:index, :show, :create]

end
