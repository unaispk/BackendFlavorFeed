const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://unaispk46:unaispk46@cluster0.irscwwt.mongodb.net/RecipeAppDatabase?retryWrites=true&w=majority&appName=Cluster0');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    recipename: { type: String, required: true },
    ingredients: { type: [String] },
    instructions: { type: String },
    images: { type: [String] },
    status: {type: String, default:"pending"}
})

const RecipeData = mongoose.model('recipe_tb', recipeSchema);
module.exports = RecipeData; 