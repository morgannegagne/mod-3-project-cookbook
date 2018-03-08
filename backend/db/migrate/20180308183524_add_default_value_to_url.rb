class AddDefaultValueToUrl < ActiveRecord::Migration[5.1]
  def change
    change_column_default :recipes, :url, 'https://semantic-ui.com/images/wireframe/image.png'
  end
end
