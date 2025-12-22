import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "ALL",
        unique: true
    }
}, {
    timestamps: true
});

export const Permission = mongoose.model("permissions", permissionSchema);