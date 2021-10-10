const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = require('./comment');
const answerSchema = require('./answers');
const votes = require('./vote');

const questionModel = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
        
    },
    content: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default:0
    },
    comments: [commentSchema],
    answers: [answerSchema],
    tags: [{
        type: String,
        required: true
    }],
    views: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('questions', questionModel);