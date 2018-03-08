class RecipeSerializer < ActiveModel::Serializer
  attributes :id, :name, :url, :directions, :created_at
  has_many :recipe_ingredients
end
