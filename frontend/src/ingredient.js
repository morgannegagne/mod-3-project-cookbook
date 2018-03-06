class Ingredient{

  constructor({id, name}){
    this.name = name
    this.id = id
  }

  render(){
    return `
      <div>
          <input type="checkbox" name="ingredients" data-id="${this.id}" class="ingredient-checkbox" tabindex="0">
          <label> ${this.name} </label>
          <div id="amounts-measures-${this.id}" style="display: none">
            <input id="amount-${this.id}" type="text" class="amount">
            <select id="measure-${this.id}">
              <option value="lbs"> lbs </option>
              <option value="cups"> cups </option>
              <option value="tablespoons"> tablespoons </option>
              <option value="teaspoons"> teaspoons </option>
              <option value="dash"> dash </option>
              <option value="pieces"> pieces </option>
            </select>
          </div>
      </div>
    `
  }

}
