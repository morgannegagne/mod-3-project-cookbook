class RecipeSerializer < ActiveModel::Serializer
  attributes :id, :name, :url, :directions
  has_many :recipe_ingredients
end
