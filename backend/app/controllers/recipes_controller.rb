class RecipesController < ApplicationController

  def index
    @recipes = Recipe.all
    render json: @recipes
  end

  def show
    @recipe = Recipe.find(params[:id])
    render json: @recipe
  end

  def create
    @recipe = Recipe.new(recipe_params)
    if @recipe.save
      ingredients = params[:recipe][:ingredients]
      ingredients.each do |ingredient|
        RecipeIngredient.create(recipe_id: @recipe.id, ingredient_id: ingredient[:id], amount: ingredient[:amount], measure: ingredient[:measure])
      end
      render json: @recipe
    else
      render json: { error: "Something went wrong."}
    end

  end

  def update

  end

  def destroy
    @recipe = Recipe.find(params[:id])
    @recipe.destroy
    render json: {alert: "Has been deleted!"}
  end

  private

  def recipe_params
    params.require(:recipe).permit(:name, :ingredients)
  end



end
