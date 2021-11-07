const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const responseHandler = require("../utils/response");
const fetchTagDesc = require("../utils/fetchTagDesc");
const Comment = require("./comments");
const Tags = require("./tags");
const sizeof = require("object-sizeof");
const Votes = require("./vote");

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    tagname: [{
        type: String,
        require: true,
    }, ],
    comments: [Comment],
    answers: [{
        type: Schema.Types.ObjectId,
        ref: "answers",
        required: false,
    }, ],
    votes: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});
postSchema.set("toJSON", { getters: true });

postSchema.options.toJSON.transform = (doc, ret) => {
    const obj = {...ret };
    delete obj._id;
    delete obj.__v;
    return obj;
};

const Post = (module.exports = mongoose.model("posts", postSchema));

module.exports.createPost = (req, result) => {
    const tagnames = req.body.tagname.toString().split(/[,]+/);
    try {
        const options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        };
        const promises = tagnames.map((tag) => {
            Tags.findOne({ tagname: tag }, { _id: 1 })
                .then((result) => {
                    if (!result) {
                        return fetchTagDesc.fetchTagDescription(tag);
                    }
                    return;
                })
                .catch((err) => {});
        });
        Promise.all(promises).then(async(results) => {
            for (let i = 0; i < tagnames.length; i++) {
                if (results[i] == null) {
                    await Tags.findOneAndUpdate({ tagname: tagnames[i] }, {
                            $inc: {
                                posts_count: 1,
                            },
                        },
                        options
                    ).catch((err) => {});
                } else {
                    await Tags.findOneAndUpdate({ tagname: tagnames[i] }, {
                            $inc: {
                                posts_count: 1,
                            },
                            $set: {
                                description: results[i],
                            },
                        },
                        options
                    ).catch((err) => {});
                }
            }
            const addPost = await Post.create({
                title: req.body.title,
                user_id: req.user.id,
                body: req.body.body,
                tagname: tagnames,
            }).catch((err) => {});
            if (addPost) {
                result(
                    null,
                    responseHandler.response(true, 200, "Post Created", addPost._id)
                );
            }
        });
    } catch (err) {
        result(responseHandler.response(false, 500, "Server Error", null), null);
    }
};

// Post_id : 6176d9fb047f6607d50b765e
module.exports.addPostComment = (req, results) => {
    try {
        const comment = {
            body: req.body.body,
            Author: req.user.id,
            post_id: req.params.post_id,
        };

        Post.findOneAndUpdate({ _id: req.params.post_id }, { $push: { comments: comment } })
            .then((result) => {
                results(
                    null,
                    responseHandler.response(
                        true,
                        200,
                        "Comment added successfully",
                        result._id
                    )
                );
            })
            .catch((err) => {
                results(
                    responseHandler.response(false, 400, "add comment failed", null),
                    null
                );
            });
    } catch (err) {
        results(responseHandler.response(false, 500, "Server Error", null), null);
    }
};
module.exports.getPostComments = (req, results) => {
    const postId = req.params.post_id;
    Post.findById({ _id: postId }, { comments: 1 })
        .populate("comments.Author", "username")
        .lean()
        .then((result) => {
            if (result) {
                const data = JSON.parse(JSON.stringify(result.comments)).map((doc) => {
                    doc.username = doc.Author.username;
                    doc.user_id = doc.Author._id;
                    doc.id = doc._id;
                    delete doc.Author;
                    delete doc._id;
                    return doc;
                });
                results(
                    null,
                    responseHandler.response(true, 200, "successfully", data)
                );
            }
        })
        .catch((err) => {
            results(responseHandler.response(false, 404, "Not found", null), null);
        });
};

module.exports.getPosts = (req, results) => {
    Post.find()
        .lean()
        .populate("user_id", "username")
        .populate("answers", "comments")
        .sort("-created_at")
        .lean()
        .then((result) => {
            result = result.map((doc) => {
                const obj = {};
                obj.id = doc._id;
                obj.user_id = doc.user_id._id;
                obj.username = doc.user_id.username;
                obj.title = doc.title;
                obj.body = doc.body;
                obj.tagname = doc.tagname;
                obj.answer_count = doc.answers != undefined ? doc.answers.length : 0;
                obj.comment_count = doc.comments != undefined ? doc.comments.length : 0;
                obj.views = doc.views;
                obj.created_at = doc.created_at;
                return obj;
            });
            if (req.params.tagname) {
                result = result.filter((doc) => {
                    return doc.tagname.includes(req.params.tagname);
                });
            } else if (req.url.includes("top")) {
                result = result.sort((a, b) => {
                    return b.answer_count - a.answer_count != 0 ?
                        b.answer_count - a.answer_count :
                        b.comment_count - a.comment_count;
                });
            }
            results(
                null,
                responseHandler.response(true, 200, "successfully", result)
            );
        })
        .catch((err) => {
            results(responseHandler.response(false, 400, "not found", null), null);
        });
};
module.exports.getOnePost = (req, results) => {
    const postId = req.params.post_id;
    Post.findOneAndUpdate({ _id: postId }, {
        $inc: {
            views: 1,
        },
    }).catch((err) => {
        results(responseHandler.response(false, 404, "not found", null), null);
    });
    Post.findById({ _id: postId })
        .populate("user_id", "username")
        .populate("answers", "comments")
        .lean()
        .then((doc) => {
            const obj = {};
            obj.id = doc._id;
            obj.user_id = doc.user_id._id;
            obj.username = doc.user_id.username;
            obj.title = doc.title;
            obj.body = doc.body;
            obj.tagname = doc.tagname;
            obj.answer_count = doc.answers != undefined ? doc.answers.length : 0;
            obj.comment_count = doc.comments != undefined ? doc.comments.length : 0;
            obj.views = doc.views;
            obj.created_at = doc.created_at;
            results(null, responseHandler.response(true, 200, "successfully", obj));
        })
        .catch((err) => {
            results(responseHandler.response(false, 400, "not found", null), null);
        });
};

module.exports.getUserPost = (req, results) => {
    try {
        Post.find({ user_id: req.params.id })
            .lean()
            .populate("user_id", "username")
            .populate("answers", "comments")
            .sort("-created_at")
            .lean()
            .then((result) => {
                result = result.map((doc) => {
                    const obj = {};
                    obj.id = doc._id;
                    obj.user_id = doc.user_id._id;
                    obj.username = doc.user_id.username;
                    obj.title = doc.title;
                    obj.body = doc.body;
                    obj.tagname = doc.tagname;
                    obj.answer_count = doc.answers != undefined ? doc.answers.length : 0;
                    obj.comment_count =
                        doc.comments != undefined ? doc.comments.length : 0;
                    obj.views = doc.views;
                    obj.created_at = doc.created_at;
                    return obj;
                });
                results(
                    null,
                    responseHandler.response(true, 200, "successfully", result)
                );
            })
            .catch((err) => {
                results(responseHandler.response(false, 404, "Not found", null), null);
            });
    } catch (err) {
        results(responseHandler.response(false, 500, "Server Error", null), null);
    }
};
module.exports.deletePost = (req, results) => {
    Post.findOneAndDelete({
                $and: [
                    { _id: req.params.post_id },
                    {
                        user_id: req.user.id
                    }
                ]
            }
            // , {
            //     $pull: { _id: req.params.post_id },
            // }
        )
        .then((result) => {
            if (result) {
                results(
                    null,
                    responseHandler.response(true, 200, "Delete post successfully", null)
                );
            } else {
                results(responseHandler.response(false, 404, "Post Not found", null), null);
            }
        })
        .catch((err) => {
            console.log(err)
            results(responseHandler.response(false, 404, "Post Not found", null), null);
        });
}
module.exports.deletePostComment = (req, results) => {
    Post.findOneAndUpdate({
            $and: [
                { _id: req.params.post_id },
                {
                    'comments._id': req.params.comment_id,
                }, {
                    'comments.Author': req.user.id
                }
            ]
        }, {
            $pull: { comments: { _id: req.params.comment_id } },
        })
        .then((result) => {
            if (result) {
                results(
                    null,
                    responseHandler.response(true, 200, "Delete comment successfully", null)
                );
            } else {
                results(responseHandler.response(false, 404, "Comment Not found", null), null);
            }
        })
        .catch((err) => {
            results(responseHandler.response(false, 404, "Not found", null), null);
        });
}