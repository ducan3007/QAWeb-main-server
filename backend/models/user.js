const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userModel = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    // profileAvatar:{type: String, default : function(){
    //     return `https://www.gravatar.com/avatar/${this._id}?s=32&d=identicon&r=PG`
    // }},
    created: { type: Date, default: Date.now }

})

userModel.set('toJSON', { getters: true });

module.exports = mongoose.model('user', userModel);