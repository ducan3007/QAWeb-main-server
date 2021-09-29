const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = require('./comment');

const answerSchema = new Schema({
    author:{
        type:Schema.Types.ObjectId;
        required:true;
    },
    text:{
        type:String,
    }
    created:{
        type:Date,
        default: Date
    }
})
module.exports = mongoose.model('answer', userModel)