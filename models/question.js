const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = require('./comment');
const answerSchema = require('./answer');
const votes = require('./vote');

const questionModel = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
    },
    votes: [votes],
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
module.exports = mongoose.model('user', questionModel);