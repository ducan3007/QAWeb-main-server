const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
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
    }
})
module.exports = commentSchema;