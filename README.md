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