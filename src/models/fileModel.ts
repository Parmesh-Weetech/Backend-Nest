import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    file: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const FileModel = mongoose.model("files", fileSchema);

export default FileModel;