const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
