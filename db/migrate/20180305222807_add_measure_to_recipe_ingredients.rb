class AddMeasureToRecipeIngredients < ActiveRecord::Migration[5.1]
  def change
    add_column :recipe_ingredients, :measure, :string
    remove_column :recipe_ingredients, :measure_id, :integer
  end
end
