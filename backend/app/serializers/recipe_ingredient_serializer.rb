class RecipeIngredientSerializer < ActiveModel::Serializer
  attributes :recipe_id, :ingredient_id, :measure, :amount, :ingredient_name
end
