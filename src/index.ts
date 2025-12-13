import express from 'express'
import sendHTMLFileRoutes from './routes/sendHTMLFileRoutes.ts';

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.use("/s", (req, res, next) => {
  console.log(req.body.name);
  res.redirect("/");
});

app.use("/status", (req, res, next) => {
  res.send('<form method="POST" action="/s"><input type="text" name="name" id="name" /><button type="submit">Submit</button></form>');
});

app.use("/file", sendHTMLFileRoutes)
app.use("/", (req, res, next) => {
  res.send("Welcome to the Home Page");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});