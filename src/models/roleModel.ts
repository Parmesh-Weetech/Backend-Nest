import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "ADMIN",
        unique: true
    },
    permissionsIds: {
        type: [String],
        required: true,
        default: ["ALL"]
    }
}, {
    timestamps: true
})

export const Role = mongoose.model("roles", roleSchema);