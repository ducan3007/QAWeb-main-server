const mongoose = require('mongoose');
const { response } = require('../utils/response');
const Schema = mongoose.Schema;
const commentSchema = require('./comments');
const responseHandler = require('../utils/response');
const { post } = require('./vote');
const Post = require('./posts');
const answerSchema = new Schema({
    post_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    votes: {
        type: Number,
        default: 0
    },
    comments: [commentSchema]
})

answerSchema.set('toJSON', { getters: true });

answerSchema.options.toJSON.transform = (doc, ret) => {
    const obj = {...ret };
    delete obj._id;
    delete obj.__v;
    return obj;
};
const Answers = module.exports = mongoose.model('answers', answerSchema);

module.exports.addAnswers = async(req, results) => {
    //url http://localhost:5001/api/posts/answers/6176c035118a04513c99f650
    try {
        await Answers.create({
            body: req.body.text,
            author: req.user.id,
            post_id: req.params.id
        }).then(async(result) => {
            const addToPost = await Post.findOneAndUpdate({ _id: req.params.id }, { $push: { answers: result._id } });
            if (addToPost) {
                results(null, responseHandler.response(true, 200, 'Answer added successfully', result._id))
            }
        });


    } catch (err) {
        console.log(err);
        results(responseHandler.response(false, 400, 'add answer failed', null), null)
    }

}
module.exports.getAnswer = async(req, results) => {
    try {
        console.log(req.params.id)
        await Answers.find({ post_id: req.params.id })
            .populate('author', 'username')
            .lean()
            .then((result) => {

                result = result.map((doc) => {
                    doc.username = doc.author.username;
                    doc.user_id = doc.author.id;
                    delete doc.author;
                    return doc
                })

                results(null, responseHandler.response(true, 200, 'successfully', result))
            })
    } catch (err) {
        console.log(err);
    }
}
module.exports.addAnswerComment = async(req, results) => {

    try {
        const comment = {
            body: req.body.body,
            Author: req.user.id,
            answer_id: req.params.answer_id
        }

        const result = await Answers.findOneAndUpdate({ _id: req.params.answer_id }, { $push: { comments: comment } });
        if (result) {
            results(null, responseHandler.response(true, 200, 'Comment added successfully', result._id))
        }
    } catch (err) {

        results(responseHandler.response(false, 400, 'add comment failed', null), null)
    }

}
module.exports.getAnswerComment = (req, results) => {
    try {
        const answerId = req.params.answer_id;

        Answers.findById({ _id: answerId }, { comments: 1 })
            .populate('comments.Author', 'username')
            .lean()
            .then((result) => {
                const data = JSON.parse(JSON.stringify(result.comments)).map((doc) => {
                    doc.username = doc.Author.username;
                    doc.user_id = doc.Author._id;
                    doc.id = doc._id;
                    delete doc.Author;
                    delete doc._id;
                    return doc
                });
                results(null, responseHandler.response(true, 200, 'successfully', data))
            });

    } catch (err) {

        results(responseHandler.response(false, 500, 'Server Error', null), null)
    }
}