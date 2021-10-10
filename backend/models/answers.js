const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = require('./comment');
const voteSchema = require('./vote');
const answerSchema = new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    content:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        default: Date.now
    },
    votes: {
        type: Number,
        default:0
      },
    comments:[commentSchema]
})
module.exports = answerSchema;