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