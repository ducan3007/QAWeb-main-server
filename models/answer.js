const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = require('./comment');
const voteSchema = require('./vote');
const answerSchema = new Schema({
    author:{
        type:Schema.Types.ObjectId,
        required:true,
    },
    content:{
        type:String,
    },
    created:{
        type:Date,
        default: Date.now
    },
    votes:[voteSchema],
    comments:[commentSchema]
})
module.exports = answerSchema;