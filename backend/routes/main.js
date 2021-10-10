const express = require('express');
const router = express.Router();
const user = require('../models/user');
const question = require('../models/question');
const answers = require('../models/answers');
const mongoose = require('mongoose');


router.get('/', (req, res) => {
    res.render("index", {
        title: "Home"
    })
})
router.get('/login', (req, res) => {
    res.render("login", {
        title: "Login"
    })
})
router.get('/u', (req, res) => {
    res.render("user");
})




router.post('/insertUser', (req, res) => {
    try {
        const saveUser = newUser.save();
        if (saveUser) {
            return res.json({
                message: "insert user successfully"
            })
        }
    } catch (error) {
        return res.json({
            message: "error"
        })
    }
})
router.post('/insertAnswer',async(req,res)=>{
   
})


router.post('/insertQuestion', async (req, res) => {
   
})

module.exports = router;