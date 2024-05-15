const express = require('express');
const RecipeData = require('../models/RecipeModel');
const recipeRouter = express.Router();
recipeRouter.use(express.static('./public'));
const multer = require('multer');
const homeRecipeData = require('../models/HomeRecipe');
const cloudinary = require('cloudinary').v2;

const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({ 
    cloud_name: "di5umyybo", 
    api_key: "996816676243548", 
    api_secret: "co0TneCKyDeRl4qyojhzlZZWJLo" 
});

const storageImage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {folder: "recipeprojectimages"}
})
const uploadImage = multer({storage:storageImage})

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) { cb(null, '../frontend/public/images/uploads/') },
//     filename: function (req, file, cb) { cb(null, file.originalname) }
// })
// const upload = multer({ storage })

recipeRouter.get('/', (req, res) => {
    RecipeData.find().then((recipes) => {
        return res.status(200).json({ success: true, error: false, data: recipes })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
});

// Approved recipes only 
recipeRouter.get('/approved', (req, res) => {
    RecipeData.find({ status: 'approved' }).then((recipes) => {
        return res.status(200).json({ success: true, error: false, data: recipes })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
});

recipeRouter.post('/addrecipe/:id', uploadImage.array('images'), (req, res) => {
    console.log(req.params.id);
    console.log("files", req.files);
    console.log(req.body.ingredients)
    const recipeDetails = {
        recipename: req.body.recipename,
        ingredients: req.body.ingredients ? (req.body.ingredients.split(',')).map(ingredients => ingredients) : '',
        // ingredients: req.body.ingredients ? (req.body.ingredients.includes(',') ? req.body.ingredients.split(',').map(ingredient => ingredient.trim()) : [req.body.ingredients.trim()]) : [],
        instructions: req.body.instructions,
        // images: req.files.map(file => file.filename) }
        images: req.files ? req.files.map((file) => file.path) : '',
        userID: req.params.id
    }
    console.log('recipeDetails ---->>', recipeDetails);

    RecipeData(recipeDetails).save().then((recipe) => {
        return res.status(200).json({ success: true, error: false, message: "Recipe added" })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
});

// Add Recipe to home screen

recipeRouter.post('/addrecipetohome', uploadImage.array('images'), (req, res) => {
    console.log("files", req.files);
    console.log(req.body.ingredients)
    const recipeDetails = {
        recipename: req.body.recipename,
        ingredients: req.body.ingredients ? (req.body.ingredients.split(',')).map(ingredients => ingredients) : '',

        // ingredients: req.body.ingredients ? (req.body.ingredients.includes(',') ? req.body.ingredients.split(',').map(ingredient => ingredient.trim()) : [req.body.ingredients.trim()]) : [],
        instructions: req.body.instructions,
        // images: req.files.map(file => file.filename) }
        images: req.files ? req.files.map((file) => file.filename) : ''
    }
    console.log('recipeDetails ---->>', recipeDetails);

    homeRecipeData(recipeDetails).save().then((recipe) => {
        return res.status(200).json({ success: true, error: false, message: "Recipe added" })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
});


recipeRouter.get('/viewsinglerecipe/:recipeId', (req, res) => {
    const id = req.params.recipeId;
    RecipeData.findOne({ _id: id }).then((recipeDetails) => {
        return res.status(200).json({ success: true, error: false, data: recipeDetails })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
});

recipeRouter.post('/approve/:recipeId', (req, res) => {
    const id = req.params.recipeId;
    RecipeData.updateOne({ _id: id }, { $set: { status: 'approved' } }).then((recipe) => {
        return res.status(200).json({ success: true, error: false, data: recipe, message: 'approved' })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
});

recipeRouter.post('/reject/:recipeId', (req, res) => {
    const id = req.params.recipeId;
    RecipeData.updateOne({ _id: id }, { $set: { status: 'rejected' } }).then((recipe) => {
        return res.status(200).json({ success: true, error: false, data: recipe, message: 'rejected' })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
});

recipeRouter.get('/view-user-recipes/:userid', (req, res) => {
    const userID = req.params.userid;
    console.log(userID);
    RecipeData.find({userID: userID }).then((usersrecipes) => {
        return res.status(200).json({ success: true, error: false, data: usersrecipes })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
})

module.exports = recipeRouter;