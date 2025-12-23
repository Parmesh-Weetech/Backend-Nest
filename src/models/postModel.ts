import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: false
    }
}, {
    timestamps: true
})

const Post = mongoose.model("post", postSchema);
export default Post;