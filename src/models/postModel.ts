import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true
})

const Post = mongoose.model("post", postSchema);
export default Post;