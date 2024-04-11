const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://unaispk46:unaispk46@cluster0.irscwwt.mongodb.net/RecipeAppDatabase?retryWrites=true&w=majority&appName=Cluster0')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String},
    password: {type: String},
    role: {type: String}
});

var UserData = mongoose.model('user_tb', userSchema);
module.exports = UserData;
