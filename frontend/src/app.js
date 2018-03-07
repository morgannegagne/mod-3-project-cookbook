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
    this.recipeDirectionsField = document.getElementById('recipe-directions')
    this.recipeUrlField = document.getElementById('recipe-url')
    this.addNewIngredient = document.getElementById('add-new-ingredient')
    this.newIngredientName = document.getElementById('new-ingredient-name')
    this.editRecipeButton = document.getElementById('edit-recipe-button')
    this.sortDateButton = document.getElementById('sort-date')
    this.sortNameButton = document.getElementById('sort-a-z')
    this.addEventListeners()
    this.fetchIngredients()
  }

  addEventListeners(){
    this.addRecipeButton.addEventListener('click', event=>{
      if (this.newRecipeForm.style.display === "none"){
        this.ingredients = []
        this.newRecipeForm.style.display = "block"
        this.submitRecipeButton.style.display = ""
        this.editRecipeButton.style.display = "none"
        this.fetchIngredients()

      } else {
        this.recipeNameField.value = ""
        this.newRecipeForm.style.display = "none"
      }
    })
    this.submitRecipeButton.addEventListener('click', event=>{
      this.saveRecipe(event)
    })
    this.editRecipeButton.addEventListener('click', event=>{
      this.patchRecipe(event)
    })
    this.addNewIngredient.addEventListener('click', event=>{
      this.createNewIngredient(event)
    })
    this.sortNameButton.addEventListener('click', event=>{
      event.target.style["font-weight"] = "bold"
      this.sortDateButton["font-weight"] = "normal"
      this.sortRecipesAlphabetically()
      this.fetchRecipes()
    })
    this.sortDateButton.addEventListener('click', event=>{
      event.target.style["font-weight"] = "bold"
      this.sortNameButton["font-weight"] = "normal"
      // sort by date function
    })
  }

  createRecipeObject(){
    let name = this.recipeNameField.value
    let url = this.recipeUrlField.value
    let directions = this.recipeDirectionsField.value

    let inputs = this.ingredientsCheckbox.children
    let checkedValues=[]
    for (let i = 0; i < inputs.length; i++){
      let checkbox = inputs[i].firstElementChild
      if (checkbox.checked){
        let ingredientObj = {}
        let id = checkbox.dataset.id
        let amountInput = document.getElementById(`amount-${id}`)
        let measureInput = document.getElementById(`measure-${id}`)
        ingredientObj.id = id
        ingredientObj.amount = amountInput.value
        ingredientObj.measure = measureInput.value
        checkedValues.push(ingredientObj)
      }
    }
    return { "recipe": {name: name, ingredients: checkedValues, url: url, directions: directions} }
  }

  saveRecipe(event){
    let newRecipeObj = this.createRecipeObject()
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

  sortRecipesAlphabetically(){
    this.recipes = this.recipes.sort((a, b) => {
      let recipeA = a.name.toUpperCase()
      let recipeB = b.name.toUpperCase()
      if (recipeA < recipeB){
        return -1;
      } else if (recipeA > recipeB){
        return 1;
      } else {
        return 0;
      }
    })
  }

  createRecipes(recipesJSON){
    recipesJSON.forEach(recipeJSON => {
      let recipe = new Recipe(recipeJSON)
      console.log(recipe)
      let ingredients = recipeJSON.recipe_ingredients
      ingredients.forEach(ingredientJSON => {
        let ingredient = new RecipeIngredient(ingredientJSON)
        recipe.recipeIngredients.push(ingredient)
      })
      this.recipes.push(recipe)
    })
    this.sortRecipesAlphabetically()
    this.render()
  }

  showEditRecipeForm(event){
    let id = event.target.dataset.id
    this.editRecipeButton.dataset.id = id
    if (this.newRecipeForm.style.display === "none"){
      this.submitRecipeButton.style.display = "none"
      this.editRecipeButton.style.display = ""
      this.newRecipeForm.style.display = "block"
      this.renderIngredients()
      let recipe = this.recipes.find(recipe => {return recipe.id == id})
      this.recipeNameField.value = recipe.name
      this.recipeDirectionsField.value = recipe.directions
      this.recipeUrlField.value = recipe.url
      let recipeIngredients = recipe.recipeIngredients
      let checkboxes = document.querySelectorAll('.ingredient-checkbox')
      checkboxes.forEach(checkbox => {
        recipeIngredients.forEach(ri => {
          if (ri.ingredient_id == checkbox.dataset.id){
            checkbox.checked = true
            let div = document.getElementById(`amounts-measures-${ri.ingredient_id}`)
            checkbox.checked ? div.style.display = "block" : div.style.display = "none"
            document.getElementById(`amount-${ri.ingredient_id}`).value = ri.amount
            document.getElementById(`measure-${ri.ingredient_id}`).value = ri.measure
          }
        })
      })
    } else {
      this.newRecipeForm.style.display = "none"
    }
  }

  patchRecipe(event){
    let recipeObj = this.createRecipeObject()
    let id = event.target.dataset.id
    console.log(recipeObj)
    fetch(`http://localhost:3000/recipes/${id}`,{
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json"
      },
      body: JSON.stringify(recipeObj)
    })
      .then(res => res.json())
      .then(json => {
        this.newRecipeForm.style.display = "none"
        this.fetchRecipes()
      })
  }

  //Create a recipe card from array of Objs
  renderRecipes(){
    return this.recipes.map(recipe => {return recipe.render()})
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
    this.sortIngredientsAlphabetically()
    this.renderIngredients()
  }

  sortIngredientsAlphabetically(){
    this.ingredients = this.ingredients.sort((a, b) => {
      let ingredientA = a.name.toUpperCase();
      let ingredientB = b.name.toUpperCase();

      if (ingredientA < ingredientB) {
        return -1;
      } else if (ingredientA > ingredientB) {
        return 1;
      } else {
        return 0
      }
    });
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
    allEditButtons.forEach(editButton => {
      editButton.addEventListener("click", event => {
        this.showEditRecipeForm(event)
        })
    })
  }

}
