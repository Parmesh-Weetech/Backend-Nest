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
- `nest new <project_name>` generate the new project.
- `nest generate <type_of_class - controller, service, module> where/file_name [options]` to generate new files with pre-defined configurations.


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

## DTOs
- Stands for Data Transfer Object
- It is basically a class or object that defines the shape of the data that is sent into or out of your application.

## Validation
- For this two libraries are used class-validator and class-transformer
- class validator is for validating incoming requests
- class-transformer is for takes plain object and convert it into the instance of a class.

## Validation Pipe
- This pipe is we can say tunnel
- This pipe has class validator and class-transformer
- first class-transformer take json object and convert it into the dto class object or instance
- Then the class-validator checks for it and if there is any error then it throws it otherwise pass the request to the controller

## IoC - Inversion of Code
- IoC is a design principle in which the control of object creation and dependency management is inverted. Instead of the component or class creating its dependencies, an external entity is responsible for creating and injecting these dependencies.
- This principle leads to more modular, testable, and maintainable code.
- DI or we can say Dependency Injection is an example of IoC
- DI means Object dependencies are provided to it instead of object creating it by its own.
- There are several types of DI, including constructor injection, property injection, and method injection.
- In NestJS, services and other injectable classes are marked with the `@Injectable()` decorator.
- Whenever there is @Injectable decorator nestjs put that class to the IoC Container.
- Nest.js resolves all the dependencies that are registered in a module in providers array

## Down side of IoC
- Although it is very useful and solve problem but it also its problems.
- suppose one service is depends on n number repo then that service has to create instance of that n repo and need to manage it.
- and that service is used by n controller so n controller has to create instance of it this is not very ideal situation
- So the solution is `dependency injection`.

## Under the hood, NestJS uses the reflect-metadata library to retain metadata about dependencies. When TypeScript is transpiled to JavaScript, type annotations are removed. However, with reflect-metadata, NestJS can retrieve the necessary type information at runtime.

## IoC means Library, framework or a run-time should take responsibility of handling and managing all the dependencies instead of it being handled/managed by the developer's code.

## DI - Dependency Injection
- When we create the nestjs application it create DI container for us in which it register all classes that is there.
- Then that container figure out which class is depending on which class
- So Controller is on Service and Service is on Repository
- So it make entry in container
- Container has two sets: 1. list of classes and dependencies 2. list of instances
- then container make linked list kind of list in which make entry that controller is depend on service and service is on repository.
- So when we create a service object it looks that service depends on repo so create instance of repo and store it in list of instance set then create service instance and store it in instance set then create controller instance and store it so there is no duplication
- each instance is contain copy of original class.