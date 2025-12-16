# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Run `docker-compose up` command
3. Run `npm start` command

## TypeORM
- Main part and very important one is DataSource

## What is DataSource?
- Your interaction with the database is only possible once you setup a DataSource. TypeORM's DataSource holds your database connection settings and establishes the initial database connection or connection pool depending on the RDBMS you use.
- To establish the initial connection/connection pool, you must call the initialize method of your DataSource instance.
- Disconnection occur when we fire destroy method
- Generally backend is working with database and every time, there is a request to backend it goes to db if it is valid then db needs to be up and running so we never explictly call destroy method.

## DataSourceOptions
- DataSource takes DataSourceOptions object as paramter. It can be different as per database.
- type: defines the type of database
- Subscribers: to be loaded and used for this data source.
- Logging: Needs to put log in console to debug the code what is going on.
- poolSize: for maximum number of active connection
- Migrations to be loaded and used for this data source
- Other general options are there like host, db_name, db_password, db_port

## Entity Options
- @Entity(): A database table will be created for such models. You work with entities everywhere in TypeORM. You can load/insert/update/remove and perform other operations with them.
- @Column(): To add database columns, you need to decorate an entity's properties you want to make into a column with a @Column decorator.
- @PrimaryColumn: To make a column a primary key, you need to use the @PrimaryColumn decorator.
- @PrimaryGeneratedColumn: To make column value auto-generated use @PrimaryGeneratedColumn decorator.

## Null and Undefined values in where cause conditions
- By default, TypeORM skips both null and undefined values in where conditions. This means that if you include a property with a null or undefined value in your where clause, it will be ignored.
- For this set invalidWhereValuesBehavior in data-source file as throw value otherwise that problem will be there and you can't do anything in production.

## Entity
- Entity is a class that maps to a database table (or collection when using MongoDB). You can create an entity by defining a new class and mark it with @Entity().
