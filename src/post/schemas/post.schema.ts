import { Schema } from 'mongoose';

export const PostSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        userId: { type: String, required: true },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);