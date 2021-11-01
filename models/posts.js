const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const responseHandler = require("../utils/response");
const fetchTagDesc = require("../utils/fetchTagDesc");
const Comment = require("./comments");
const Tags = require("./tags");
const sizeof = require("object-sizeof");
const Votes = require("./vote");

const NodeCache = require("node-cache");
const Cache = new NodeCache();

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

const addTags = async(tagnames) => {
    const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
    };
    const query = {
        $inc: {
            posts_count: 1,
        },
    };
    // var promises = tagnames.map(tag => fetchTagDesc.fetchTagDescription(tag));
    // Promise.all(promises)
    //     .then(results => {
    //         console.log(results)
    //         for (let i = 0; i < tagnames.length; i++) {
    //             Tags.findOneAndUpdate({ tagname: tagnames[i], description: results[i] }, query, options);
    //         };

    //     })

    let tagDescription;
    for (let tag of tagnames) {
        tagDescription = Cache.get(tag);
        if (!tagDescription) {
            tagDescription = await fetchTagDesc.fetchTagDescription(tag);
            Cache.set(tag, tagDescription);
        }
        const result = await Tags.findOneAndUpdate({ tagname: tag, description: tagDescription },
            query,
            options
        );
        if (!result) {
            return;
        }
    }

    return true;
};

module.exports.createPost = (req, result) => {
    const tagnames = req.body.tagname.toString().split(/[,]+/);
    console.log(tagnames);
    try {
        const options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        };
        const promises = tagnames.map((tag) => {
            Tags.findOne({ tagname: tag }, { _id: 1 }).then((result) => {
                if (!result) {
                    console.log("fetching tag desc.......");
                    return fetchTagDesc.fetchTagDescription(tag);
                }
                return;
            });
        });
        Promise.all(promises).then(async(results) => {
            console.log(results);
            console.log(tagnames.length);
            for (let i = 0; i < tagnames.length; i++) {
                if (results[i] == null) {
                    await Tags.findOneAndUpdate({ tagname: tagnames[i] }, {
                            $inc: {
                                posts_count: 1,
                            },
                        },
                        options
                    );
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
                    );
                }
            }
            const addPost = await Post.create({
                title: req.body.title,
                user_id: req.user.id,
                body: req.body.body,
                tagname: tagnames,
            });
            if (addPost) {
                result(
                    null,
                    responseHandler.response(true, 200, "Post Created", addPost._id)
                );
            }
        });
    } catch (err) {
        result(responseHandler.response(false, err.code, err.message, null), null);
    }

    // console.log(tagnames);
    // try {
    //     // const addPost = await Post.create({
    //     //     title: req.body.title,
    //     //     user_id: req.user.id,
    //     //     body: req.body.body,
    //     //     tagname: tags
    //     // });
    //     // const addTag = await addTags(tags);
    //     const [addPost, addTag] = await Promise.all([Post.create({
    //         title: req.body.title,
    //         user_id: req.user.id,
    //         body: req.body.body,
    //         tagname: tagnames
    //     }), addTags(tagnames)])

    //     if (addPost && addTag) {
    //         result(null, responseHandler.response(true, 200,
    //             'Post Created', addPost._id));
    //     } else {
    //         result(null, responseHandler.response(false, 500,
    //             'Post creation failed', null));
    //     }
    // } catch (err) {
    //     console.log(err);
    //     result(responseHandler.response(
    //         false,
    //         err.code,
    //         err.message,
    //         null), null)
    // }
};

// Post_id : 6176d9fb047f6607d50b765e
module.exports.addPostComment = async(req, results) => {
    try {
        const comment = {
            body: req.body.body,
            Author: req.user.id,
            post_id: req.params.post_id,
        };

        const result = await Post.findOneAndUpdate({ _id: req.params.post_id }, { $push: { comments: comment } });
        if (result) {
            results(
                null,
                responseHandler.response(
                    true,
                    200,
                    "Comment added successfully",
                    result._id
                )
            );
        }
    } catch (err) {
        results(
            responseHandler.response(false, 400, "add comment failed", null),
            null
        );
    }
};
module.exports.getPostComments = async(req, results) => {
    try {
        const postId = req.params.post_id;

        Post.findById({ _id: postId }, { comments: 1 })
            .populate("comments.Author", "username")
            .lean()
            .then((result) => {
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
            });
    } catch (err) {
        results(responseHandler.response(false, 500, "Server Error", null), null);
    }
};

module.exports.getPosts = async(req, results) => {
    try {
        if (req.params.tagname) {} else if (req.url.includes("tog")) {} else {
            Post.find()
                .lean()
                .populate("user_id", "username")
                .populate("answers", "comments")
                .sort("-created_at")
                .lean()
                .then((result) => {
                    console.log(sizeof(result));
                    result = result.map((doc) => {
                        const obj = {};
                        obj.id = doc._id;
                        obj.user_id = doc.user_id._id;
                        obj.username = doc.user_id.username;
                        obj.title = doc.title;
                        obj.body = doc.body;
                        obj.tagname = doc.tagname;
                        obj.answer_count =
                            doc.answers != undefined ? doc.answers.length : 0;
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
                });

            //     Post.aggregate([{
            //             $lookup: {
            //                 from: "users",
            //                 localField: "user_id",
            //                 foreignField: "_id",
            //                 as: "author"
            //             }
            //         },
            //         {
            //             $lookup: {
            //                 from: "answers",
            //                 localField: "answers.answer_id",
            //                 foreignField: "_id",
            //                 as: "answers"
            //             }
            //         }, {
            //             $project: {
            //                 _id: 1,
            //                 title: 1,
            //                 user_id: 1,
            //                 tagname: 1,
            //                 voets: 1,
            //                 views: 1,
            //                 "username": "$author.username",
            //                 "comment_count": { $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: "0" } },
            //                 "answers_count": { $cond: { if: { $isArray: "$answers" }, then: { $size: "$answers" }, else: "0" } },
            //                 created_at: 1,
            //             }
            //         }
            //     ]).then((result) => {
            //         console.log(sizeof(result));
            //         results(null, responseHandler.response(true, 200, 'successfully', result))
            //     })
        }
    } catch (err) {
        results(responseHandler.response(false, 500, "server error", null), null);
    }
};
module.exports.getOnePost = async(req, results) => {
    try {
        const postId = req.params.post_id;
        await Post.findOneAndUpdate({ _id: postId }, {
            $inc: {
                views: 1,
            },
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
            });
    } catch (err) {}
};

module.exports.getUserPost = (req, results) => {
    try {
        console.log(req.params.id);
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
            });
    } catch (err) {
        results(responseHandler.response(false, 500, "Server Error", null), null);
    }
};