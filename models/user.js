const mongoose = require('mongoose')
const Schema = mongoose.Schema

 const userModel = new Schema({
    username: { type: String, required : true, unique : true},  
    password: {type: String, required: true},
    email: {type: String, required: true},
    birth: {type: String, required:false},
    profileAvatar:{type: String, default : function(){
        return `https://www.gravatar.com/avatar/${this._id}?s=32&d=identicon&r=PG`
    }}

 })
    
module.exports = mongoose.model('user', userModel)