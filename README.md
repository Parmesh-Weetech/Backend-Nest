## MongoDB
- Mongodb is so famous because of its flexibility and speed.

- Mongodb find method returns the cursor which is also a object kind of things but it has pagination kind of concept in which all documents or result gives over the wires will not affect any kind of issue.

- Mongodb is document database.

- Mongoose is ODM - Object Document Mapping, It is just like ORM.

## Authentication with NodeJs + ExpressJs

## What are cookies?
- cookies are small information that is stored in client side browser to track whether user is loggedIn or making sure user is doing right activity and which ever activity user is doing which is doing by right user.
- cookies size are very small
- Mostly used to store the information of sessions,

## What are session?
- Sessions in Express enable the server to maintain user-specific data across multiple requests by storing information server-side and associating it with a unique session identifier. This approach allows for persistent user interactions and state management within web applications.

## Project Idea
- This project has mainly has one admin which is created by creator.
- Admin has full system access of this project.
- Admin can do CRUD on user, as well as Posts.
- Admin create a set of user which has permissions which combines and make one role which is assigned to one user which is in db.
- based on this permissions and roles user can perform CRUD on posts.
- but by default all user can see all posts.
- This project include RBAC, permissions, login, signup, crud on user, and crud post based on roles and permissions with validation and reset password.
- Session based authentication with csrf token.

## File Uploading with multer
- There are mainly two ways to upload the file
- Disk storage and buffer storage
- disk storage means storing entire file in disk or we cna say in secondary memory and path to it stored in RAM.
- buffer storage means storing entire file in RAM
- both has its prons and cons
- in disk storage prons are lower memory consumption, and cons are writing into file can take more time.
- in buffer storage prons are writing into file is easy but it has higher memory consumption.
- Another cons we can say that is buffer storage only keeps the file in memory or RAM (as a buffer), there is no file path unless you manually write the file to disk.
- When we use disk storage multer write file in physical disk or we can say secondary memory so in req.file it has metadata.

## Stream Approach for files
- The stream approach (also called streaming file upload) is a method of processing the file in smaller chunks as it is being uploaded, without needing to store the entire file in memory at once.
- Streams allow you to process and handle the file as it's being uploaded, making it much more memory-efficient and suitable for large files.
- The file is read as a stream and processed incrementally. The file isn't fully loaded into memory at any point.
- streaming file is efficient for larger file.
- stream approach can be complex sometimes.

## REST API
- Representational State Transfer full form of REST

## Rest Principles
- Uniform Interface: Clearly defined api endpoint, request object, response object
- Stateless Interaction: Every request should be handled seprately, should not store any connection history.
- Server and client are seprated and should not connect to each other with persistent data storage.

## Rest api fundamental rule is every entity should only used to do the data exchange.

## JSON Data + Signature = JSON Web Token (jwt)