const express = require('express');
const UserData = require('../models/UserModel');
const userRouter = express.Router();

userRouter.use(express.static('./public'));

userRouter.get('/', (req, res) => {
    UserData.find().then((user) => {
        return res.status(200).json({ success: true, error: false, data: user })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
});

userRouter.post('/registeruser', async (req, res) => {
    try {
        const UserDetails = { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: req.body.password, role: "user" }
        const oldUser = await UserData.findOne({ email: req.body.email })
        if (oldUser) {
            return res.status(400).json({ success: false, error: true, message: "User Exists" })
        }
        const saveData = await UserData(UserDetails).save()

        if (saveData) {
            return res.status(200).json({ success: true, error: false, data: saveData, message: 'Registration Completed' })
        } else {
            return res.status(400).json({ success: false, error: true, message: 'Registration not Completed' })
        }
    } catch (error) {
        return res.status(400).json({ success: false, error: true, message: 'Server error', details: error })
    }
});

userRouter.get('/viewsingleuser/:userId', (req, res) => {
    const id = req.params.userId

    UserData.findOne({ _id: id }).then((UserDetails) => {
        return res.status(200).json({ success: true, error: false, data: UserDetails })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: ture, data: error })
    })
});

userRouter.post('/updateuserdata/:userId', (req, res) => {
    const userDetails = { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: req.body.password }
    const id = req.params.userId;
    UserData.updateOne({ _id: id }, { $set: userDetails }).then((updatedUser) => {
        return res.status(200).json({ success: true, error: false, data: updatedUser })
    }).catch((error) => {
        return res.status(400).json({ success: false, error: true, data: error })
    })
});

userRouter.post('/login', async (req, res) => {
    try {
        const oldEmail = await UserData.findOne({ email: req.body.email })
        if (!oldEmail) {
            return res.status(400).json({success: false, error: true, message: "User not found"})
        }

        if(oldEmail.password !=  req.body.password) {
            return res.status(400).json({ success: false, error: true, message: "Incorrect  password"})
        } else {
            return res.status(200).json({ success: true, error: false, data: oldEmail, message: 'Login success'})
        }

    } catch (error) {
        return res.status(400).json({ success: false, error: true, message: 'Server error'})
    }
})
module.exports = userRouter;