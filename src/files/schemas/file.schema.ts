import { Schema } from 'mongoose';

export const FileSchema = new Schema(
    {
        userId: { type: String, required: false },

        path: { type: String, required: true },

        bucket: { type: String, required: true },

        originalFileName: { type: String, default: 'default.png' },

        mimeType: { type: String, default: 'image/png' },

        status: {
            type: String,
            enum: ['PENDING', 'ACTIVE', 'ORPHAN'],
            default: 'PENDING',
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);
