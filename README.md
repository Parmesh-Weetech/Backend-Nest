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
- config
- routes
- controllers
- middlewares
- utils
- models
- views
- Public