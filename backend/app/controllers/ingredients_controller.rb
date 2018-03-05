class IngredientsController < ApplicationController

  def index
    @ingredients = Ingredient.all
    render json: @ingredients
  end

  def show
    @ingredient = Ingredient.find(params[:id])
    render json: @ingredient
  end

  def create
    @ingredient = Ingredient.new(ingredient_params)
    if @ingredient.save
      render json: @ingredient
    else
      render json: { error: "Something went wrong."}
    end

  end

  def update

  end

  def destroy

  end

  private

  def ingredient_params
    params.require(:ingredient).permit(:name)
  end

end
