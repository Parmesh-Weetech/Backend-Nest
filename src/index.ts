import express from "express";
import "dotenv/config";
import { connectMongo } from "./config/mongo.ts";
import userRoute from './routes/userRoute.ts'

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

const startServer = async () => {
    await connectMongo().catch((err) => {
        console.error("❌ Startup error:", err);
        process.exit(1);
    });;
};

app.use("/user", userRoute);
app.get("/", () => {
    console.log("running")
})

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

startServer();
