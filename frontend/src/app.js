class App {
  constructor(){
    this.recipes = []
    this.ingredients = []
    this.recipesContainer = document.getElementById('recipes')
    this.addRecipeButton = document.getElementById('add-new-recipe')
    this.newRecipeForm = document.getElementById('new-recipe-form')
    this.ingredientsCheckbox = document.getElementById('ingredients-checkbox')
    this.submitRecipeButton = document.getElementById('submit-new-recipe')
    this.recipeNameField = document.getElementById('recipe-name')
    this.addNewIngredient = document.getElementById('add-new-ingredient')
    this.newIngredientName = document.getElementById('new-ingredient-name')
    this.addEventListeners()
  }

  addEventListeners(){
    this.addRecipeButton.addEventListener('click', event=>{
      if (this.newRecipeForm.style.display === "none"){
        this.ingredients = []
        this.newRecipeForm.style.display = "block"
        this.fetchIngredients()

      } else {
        this.newRecipeForm.style.display = "none"
      }
    })
    this.submitRecipeButton.addEventListener('click', event=>{
      this.saveRecipe(event)
    })
    this.addNewIngredient.addEventListener('click', event=>{
      this.createNewIngredient(event)
    })
  }

  saveRecipe(event){
    let name = this.recipeNameField.value
    let inputs = this.ingredientsCheckbox.children
    let checkedValues=[]
    for (let i = 0; i < inputs.length; i++){
      let checkbox = inputs[i].firstElementChild
      if (checkbox.checked){
        let ingredientObj = {}
        let id = checkbox.dataset.id
        let amountInput = document.getElementById(`amount-${id}`)
        let measureInput = document.getElementById(`measure-${id}`)
        // console.log(amountInput.value, measureInput.value)

        ingredientObj.id = id
        ingredientObj.amount = amountInput.value
        ingredientObj.measure = measureInput.value
        // console.log(ingredientObj)
        checkedValues.push(ingredientObj)

      }
    }
    let newRecipeObj = { "recipe": {name: name, ingredients: checkedValues} }
    console.log(newRecipeObj)
    fetch('http://localhost:3000/recipes', {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accepts: "applicatin/json"
      },
      body: JSON.stringify(newRecipeObj)
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        this.recipes = []
        this.ingredients =[]
        this.newRecipeForm.style.display = "none"
        this.recipeNameField.value = ""
        this.fetchRecipes()
      })
  }

  fetchRecipes(){
    this.recipes = [];
    fetch('http://localhost:3000/recipes')
      .then(res => res.json())
      .then(json => this.createRecipes(json))
  }

  createRecipes(recipesJSON){
    recipesJSON.forEach(recipeJSON => {
      let recipe = new Recipe(recipeJSON)
      let ingredients = recipeJSON.recipe_ingredients
      ingredients.forEach(ingredientJSON => {
        let ingredient = new RecipeIngredient(ingredientJSON)
        recipe.recipeIngredients.push(ingredient)
      })
      this.recipes.push(recipe)
    })
    this.render()
    let cardDivs = document.querySelectorAll('.recipe-card')
    cardDivs.forEach(card => {
      card.addEventListener('click', event => {


      })
    })
  }

  //Create a recipe card from array of Objs
  renderRecipes(){
    return this.recipes.map(recipe => {
      return recipe.render()
    })
  }

  fetchIngredients(){
    fetch('http://localhost:3000/ingredients')
      .then(res => res.json())
      .then(json => this.createIngredients(json))
  }

  createIngredients(ingredientsJSON){
    this.ingredients = []
    ingredientsJSON.forEach(ingredientJSON => {
      let ingredient = new Ingredient(ingredientJSON)
      this.ingredients.push(ingredient)
    })
    this.renderIngredients()
  }

  createNewIngredient(event){
    let name = this.newIngredientName.value
    let ingredientObj = {ingredient: {name: name}}
    this.newIngredientName.value = ""
    fetch('http://localhost:3000/ingredients', {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json"
      },
      body: JSON.stringify(ingredientObj)
    })
      .then(res => res.json())
      .then(json => this.fetchIngredients())
  }

  renderIngredients(){
    let ingredientHTML = this.ingredients.map(ingredient => {return ingredient.render()}).join('')
    this.ingredientsCheckbox.innerHTML = ingredientHTML
    let checkboxes = document.querySelectorAll('.ingredient-checkbox')
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('click', event => {
        let id = event.target.dataset.id
        let div = document.getElementById(`amounts-measures-${id}`)
        event.target.checked ? div.style.display = "block" : div.style.display = "none"
      })
    })
  }

  //Create an IngrCard
  renderRecipeIngredientCards(){
    return this.recipes.map(recipe => {
      // console.log(recipe.renderIngredientsCard())
      return recipe.renderIngredientsCard()})
  }

  render(){
    this.recipesContainer.innerHTML = this.renderRecipes().join('')
    let allDeleteButtons = document.querySelectorAll(".delete-button")
    let allEditButtons = document.querySelectorAll(".edit-button")

    allDeleteButtons.forEach(deleteButton => {
      deleteButton.addEventListener("click", event => {
        fetch(`http://localhost:3000/recipes/${event.target.dataset.id}`,{
          method: "DELETE"
        })
        .then(res => res.json())
        .then(json => this.fetchRecipes())
      })
    })
  }

}