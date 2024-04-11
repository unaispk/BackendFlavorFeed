const express = require('express');
const RecipeData = require('../models/RecipeModel');
const recipeRouter = express.Router();
recipeRouter.use(express.static('./public'));

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, '../frontend/public/images/uploads/') },
    filename: function (req, file, cb) { cb(null, file.originalname) }
})
const upload = multer({ storage })

recipeRouter.get('/', (req, res) => {
    RecipeData.find().then((recipes) => {
        return res.status(200).json({ success: true, error: false, data: recipes })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
}); 

// Approved recipes only 
recipeRouter.get('/approved', (req, res) => {
    RecipeData.find({status: 'approved'}).then((recipes) => {
        return res.status(200).json({ success: true, error: false, data: recipes })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
});

recipeRouter.post('/addrecipe', upload.array('images'), (req, res) => {
    console.log("files",req.files);
    console.log(req.body.ingredients)
    const recipeDetails = { recipename: req.body.recipename, 
        ingredients: req.body.ingredients? (req.body.ingredients.split(',')).map(ingredients => ingredients): '',
        
        // ingredients: req.body.ingredients ? (req.body.ingredients.includes(',') ? req.body.ingredients.split(',').map(ingredient => ingredient.trim()) : [req.body.ingredients.trim()]) : [],
        instructions: req.body.instructions,
        // images: req.files.map(file => file.filename) }
        images: req.files ? req.files.map((file) => file.filename) : '' }
    console.log('recipeDetails ---->>', recipeDetails);

    RecipeData(recipeDetails).save().then((recipe) => {
        return res.status(200).json({ success: true, error: false, message: "Recipe added" })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
});

recipeRouter.get('/viewsinglerecipe/:recipeId', (req, res) => {
    const id = req.params.recipeId;
    RecipeData.findOne({_id : id}).then((recipeDetails) => {
        return res.status(200).json({ success: true, error: false, data: recipeDetails })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
});

recipeRouter.post('/approve/:recipeId', (req, res) => {
    const id = req.params.recipeId;
    RecipeData.updateOne({ _id: id }, { $set: {status: 'approved'} }).then((recipe) => {
        return res.status(200).json({ success: true, error: false, data: recipe, message: 'approved' })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
});

recipeRouter.post('/reject/:recipeId', (req, res) => {
    const id = req.params.recipeId;
    RecipeData.updateOne({ _id: id }, { $set: {status: 'rejected'} }).then((recipe) => {
        return res.status(200).json({ success: true, error: false, data: recipe , message: 'rejected' })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
});

module.exports = recipeRouter;