import mongoose from "mongoose";

export const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);

        console.log("✅ Mongoose connected");
    } catch (err) {
        console.error("❌ Mongoose connection failed", err);
        process.exit(1);
    }
};
