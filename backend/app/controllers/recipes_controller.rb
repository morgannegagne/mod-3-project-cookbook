class RecipesController < ApplicationController

  # before_action :set_s3_direct_post, only: [:new, :edit, :create, :update]

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
      if ingredients
        ingredients.each do |ingredient|
          RecipeIngredient.create(recipe_id: @recipe.id, ingredient_id: ingredient[:id], amount: ingredient[:amount], measure: ingredient[:measure])
      end
      end
      render json: @recipe
    else
      render json: { error: "Something went wrong."}
    end

  end

  def update
    @recipe = Recipe.find(params[:id])
    @recipe.update(recipe_params)
    @recipe.recipe_ingredients.destroy_all
    ingredients = params[:recipe][:ingredients]
    ingredients.each do |ingredient|
      RecipeIngredient.create(recipe_id: @recipe.id, ingredient_id: ingredient[:id], amount: ingredient[:amount], measure: ingredient[:measure])
    end
    render json: @recipe
  end

  def destroy
    @recipe = Recipe.find(params[:id])
    @recipe.destroy
    render json: {alert: "Has been deleted!"}
  end

  private

    def recipe_params
      params.require(:recipe).permit(:name, :ingredients, :url, :directions)
    end

    # def set_s3_direct_post
    #   @s3_direct_post = S3_BUCKET.presigned_post(key: "uploads/#{SecureRandom.uuid}/${filename}", success_action_status: '201', acl: 'public-read')
    # end

end
