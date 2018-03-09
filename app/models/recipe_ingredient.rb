class RecipeIngredient < ApplicationRecord
  belongs_to :recipe
  belongs_to :ingredient
  after_initialize :update_ingredient_name

  def update_ingredient_name
    # byebug
    self.update(ingredient_name: self.ingredient.name)

  end
end
