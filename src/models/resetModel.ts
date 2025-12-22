import mongoose, { Schema } from "mongoose";

const resetSchema = new mongoose.Schema({ 
    resetLink: {
        type: String,
        required: true
    },
    resetTime: {
        type: Date,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, {
    timestamps: true
})

const Reset = mongoose.model("reset", resetSchema);

export default Reset;