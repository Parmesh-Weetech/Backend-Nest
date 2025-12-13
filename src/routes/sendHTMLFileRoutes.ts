import express from 'express';
import path from 'path';
const __dirname = path.resolve();

const router = express.Router();

router.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "./src", "views", "index.html"));
});

export default router;