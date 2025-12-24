# NestJs
- Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications.
- First support to TypeScript
- It combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).
- Under the hood use, Express
- Nest gives you a clean structure and rules (like controllers, services, modules) so your app is easier to build and maintain.
- But you can still use the express features
- Nest provides an out-of-the-box application architecture which allows developers and teams to create highly testable, scalable, loosely coupled, and easily maintainable applications. 
- The architecture is heavily inspired by Angular.

## Nest CLI
- In order to get start with nestjs, the nest cli is most important.

## Nest Packages
1. @nestjs/common - package is a core component of the NestJS framework that provides essential decorators, classes, and utilities for building scalable server-side applications. It contains the fundamental modules of NestJs which is controller, providers, modules, and more.
2. @nestjs/core - package use to have a clean architecture, dependency injection (NestJs heavily use it. Basically NestJs has heavy IoC means Inversion of Control which means you don’t create things yourself — NestJS creates them and gives them to you.), NestFactory which includes static methods to start and manage servers, DiscoveryService which enables developers to dynamically inspect and retrieve metadata about providers and controllers at runtime
3. @nestjs/platform-express - package is the default HTTP server platform used by the NestJS framework. NestJs provides an abstraction that makes your application largely platform-agnostic. This means we write application logic in NestJs and NestJs under the hood manage connection with ExpressJs.
4. Reflect Metadata - It is a way to attach extra information to classes and methods. Reflect Metadata lets NestJS store and read extra information about your code using decorators.

## Nest Server
- In background nestjs doesn't handle incoming http request but it rely on express or fastify. Default is to express
- In any backend framework we need to follow fixed number of steps in order to fullfil that request
    - 1. When request come to backend need to validate the request data
    - 2. then make sure user is authenticated
    - 3. pass the request to particular endpoint function
    - 4. run some business logic
    - 5. then access the database and change/add/delete/read the information.
- In order to perform these five steps nestjs has very specific tools
    1. Pipe - Pipe is used to validate the request data.
    2. Guard - Guard is used to make sure user is authenticated.
    3. Controller - used to pass request to particular endpoint
    4. service - for business logic
    5. repository - access database
- Another tools are
    - Modules - used to group the code together
    - Filter - catch errors and control how error responses are sent to the client.
    - Interceptors - run code before and after a request is handled in order to change the request or response.

## Any nestjs application must have modules and controllers

## First file that is gets executed that is `main.ts`.

- When application starts nestjs will first going to look at modules and get to know how many controllers are there and create the instance of that.

## NestFactory
- A helper provided by NestJS.
- It knows how to create a Nest application (HTTP server, microservice, etc.).
- create method read all controller, service and create dependency injection containers and setup routing, middleware, interceptors

## What happens when we do NestFactory.create(module)?
NestFactory.create(AppModule)
  ↓
1. Build the module tree from AppModule
  ↓
2. Create all providers (services) using IoC
  ↓
3. Set up controllers and routes
  ↓
4. Initialize middleware, pipes, guards, interceptors
  ↓
5. Return a NestApplication instance
