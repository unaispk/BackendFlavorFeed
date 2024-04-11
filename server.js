const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRouter = require('./src/routes/UserRoute');
const recipeRouter = require('./src/routes/RecipeRoute');

app.use(express.static('./public'));

const cors = require('cors');
app.use(cors());
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use(express.urlencoded({ extended: true }))

app.use('/user', userRouter);
app.use('/recipe', recipeRouter);

app.listen(2001, () => {
    console.log("Server started at  http://localhost:2001/");
})
