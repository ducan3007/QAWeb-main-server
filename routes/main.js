const express = require('express')
const router = express.Router()
const home = 

router.get('/', (req, res) => {
    res.render("index", {
        title: "Home"
    })
})
router.get('/login', (req,res)=>{
    res.render("login", {
        title: "Login"
    })
})
router.get('/u',(req,res)=>{
    res.render("user");
})

module.exports = router;