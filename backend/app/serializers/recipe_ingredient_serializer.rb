class RecipeIngredientSerializer < ActiveModel::Serializer
  attributes :id, :recipe_id, :ingredient_id, :measure, :amount, :ingredient_name
end
