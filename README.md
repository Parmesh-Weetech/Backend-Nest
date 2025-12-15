## What is NodeJs?
- As we know nodejs is a open-source runtime environment in which it takes the JS from browser to server.

## Event driven architecture
- NodeJs follow event driven architecture to handle number of request and events. Using this event driven architecture it handle request simenteniously without any freeze.
- Basically it is a design pattern where application respond to event. So, rather than following any sequence program follow event when event occur it respond.
- This makes applications more flexible and responsive.
- There are mainly four-five main things are there in event driven architecture.
1. Events: user perform any action
2. Event loop: Core heart
3. callback: nodejs fire it when event occur.
4. non-blocking and asynchronous flow.
- EventEmitter is main core module behind this to manage custom events.

## Buffers and streams
- Buffers are the space in memory outside the v8 engine which is used to store raw binary data.
- streams are collection of data which is in chunks means data is divided into the some pieces.
- Buffers are designed to work with raw binary data, file system etc,
- Buffers are particularly useful because they allow Node.js to handle and manipulate data directly without having to convert it to a string first.
- `req` and `res` is streams in node.

## Debugging nodejs application
- We can debug the nodejs application by using vscode debuger.
- If you want you can add more configuration for debuger we can do that by putting configuration in .vscode folder.

## Requesting with express and use of req.use method
- req.use is a middleware function that mainly used to have a middleware that can run in between request and response.
- There is an another use of req.use that we can also use it to handle for endpoint but if we have two different endpoint in which one is "/" and second one can be anything in this case put the second route before "/" route because other wise it will only use "/" because express checks that any route starts with "/" or not if it is then match the "/" of use.
- Do not use the next method in this case otherwise it will go to the next endpoint.

## The difference between express.Router() and express()
- `express()` creates the main application instance, which has the full functionality of an Express app, including the ability to start a server.
- `express.Router()` creates an isolated "mini-app" instance that only handles middleware and routing functions, making it ideal for organizing routes into modular files.
- `express()` is the main application object the manage the entire server configuration and lifecycle.
- `express.Router()` is a mountable, modular handler that used to group the route and middleware related codes.

## Folder structure
- `/config`
- `/routes`
- `/controllers`
- `/middlewares`
- `/utils`
- `/models`
- `/views`
- `/Public`

## Template engines
- template engines are the tool that used to generate dynamic HTML Content on server side.
- It allows to merge the static files with dynamic content.
- You can replace the placeholder in that engine file with proper values.
- Most global used template engine is ejs or electron.js.
- Other example are Pug, Handlebars.

## MVC Structure
- MVC stands for model view controller
- It is all about sepration concern.
- Model means basically object that is part of code which is responsible for data in code means database schema, request object, etc.
- View means whatever user see in the ui part and whatever backend is sending to frontend in order to show it basically data mapping to frontend.
- Controller means on whatever endpoint frontend is sending request basically the first part of backend which gets interaction with frontend data, headers that is Controller which is responsible for defining backend endpoints on which frontend will send requests.
- Views are responsible for rendering right html in code.
- Controllers are act like bridge between Views and Models. It is like in-between person to both.
- This separation of concerns makes code cleaner, more maintainable, scalable, and easier to collaborate on, widely used in web, desktop, and mobile development for organizing complex UIs and business logic.
- Model doesn't matter if we are storing data in db, files, or in static variable.

## Vertical Scaling and Horizontal Scaling in SQL and NoSQL
- Vertical Scaling means adding more cpu, storage to the database server.
- Horizontal Scaling means adding more server in order to improve performance, more data storage.

## SQL vs NoSQL
- There always be a particular structure is there in SQL where as NoSQL doesn't has any particular structure that needs to follow.
- There are multiple relation is there in SQL and there is no relation in NoSQL.
- Horizontal Scaling is difficult in SQL but Vertical Scaling can be easy and possible.
- In NoSQL, Horizontal and Vertical Scaling is possible but needs to follow some pattern

## ORMs and type of it
- ORM basically stands for Object Relational Mapper 
- The main problem is while working with RDBMS is every time we need to write the query and for different result we have different queries which can be complex once after multiple tables result needs to includes in single result.
- That's why ORM is there.
- ORM just proide a build in function that in background write the complex to easy queries for us but for that we just need to call the in-build functions of that ORM.
- One of the popular example for this is Prisma or TypeORM
- There is another concept while working with mongodb which is ODM means Object Document Mapping which is also similar to ORM but it is in mongodb means NoSQL database.
- Example of this ORMs are Prisma, Sequelize, TypeORM, etc.

## Features of Sequelize
- Models & Associations
- Transactions
- Inbuild Query
- Migrations
- Hooks & Events