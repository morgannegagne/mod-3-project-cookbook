class AddRecipeNameToRecipeIngredients < ActiveRecord::Migration[5.1]
  def change
    add_column :recipe_ingredients, :ingredient_name, :string
  end
end
