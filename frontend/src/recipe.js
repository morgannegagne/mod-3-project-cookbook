class Recipe{

  constructor({id, name, created_at}){
    this.name = name
    this.id = id
    this.created_at = created_at.split('T')[0]
    this.recipeIngredients = []
  }

  render(){
    return `
      <div id="recipe-${this.id}" class="column recipe-card">
        <div class="flipper">

          <div class="front">
            <div class="ui fluid card">

              <div class="image">
                <img src="#">
              </div>
              <div class="content">
                <a class="header">${this.name}</a>
              </div>

            </div>
          </div>

          <div class="back">
            <div class="ui fluid card">
              <div class="content"><a class="header">${this.name}</a></div>
              <ul id="ingredient-list"> ${this.renderIngredients().join('')}</ul>
              <div class="extra content">
                <div class="ui two buttons">
                  <div data-id="${this.id}" class="ui basic green button edit-button">Edit</div>
                  <div data-id="${this.id}" class="ui basic red button delete-button">Delete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
  //
  // renderIngredientsCard(){
  //   return `<div class="column">
  //     <div class="ui fluid card">
  //
  //       <div class="content">
  //         <a class="header">${this.name}</a>
  //       </div>
  //       <ul id="ingredient-list"> ${this.renderIngredients().join('')}</ul>
  //     </div>
  //   </div>
  // `
  // }

  renderIngredients(){
    return this.recipeIngredients.map(ri => {return ri.render()})
  }


}
