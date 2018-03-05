class RecipesController < ApplicationController

  def index
    @recipes = Recipe.all
    render json: @recipes
    # , include: ['ingredients', "recipe_ingredients"]
  end

  def show
    @recipe = Recipe.find(params[:id])
    render json: @recipe
  end

  def create
    @recipe = Recipe.new(recipe_params)
    if @recipe.save
      render json: @recipe
    else
      render json: { error: "Something went wrong."}
    end

  end

  def update

  end

  def destroy

  end

  private

  def recipe_params
    params.require(:recipe).permit(:name)
  end



end
