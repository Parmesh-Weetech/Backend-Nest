import express from 'express'
import authenticationRoute from './routes/authentication-route.ts'

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "./src/views");

// app.use("/s", (req, res, next) => {
//   console.log(req.body.name);
//   res.redirect("/");
// });

// app.use("/status", (req, res, next) => {
//   res.send('<form method="POST" action="/s"><input type="text" name="name" id="name" /><button type="submit">Submit</button></form>');
// });

// app.use("/file", sendHTMLFileRoutes)
// app.use("/", (req, res, next) => {
//   res.send("Welcome to the Home Page");
// });

// app.use('/', authenticationRoute)

app.get('/', (req, res) => {
  res.render('index', { title: req.body.title, description: req.body.description });
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});