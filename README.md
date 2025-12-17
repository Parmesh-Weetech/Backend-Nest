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
- poolSize: for maximum number of active connection.
- Migrations to be loaded and used for this data source.
- Other general options are there like host, db_name, db_password, db_port.

## Entity Options
- @Entity(): A database table will be created for such models. You work with entities everywhere in TypeORM. You can load/insert/update/remove and perform other operations with them.
- @Column(): To add database columns, you need to decorate an entity's properties you want to make into a column with a @Column decorator.
- @PrimaryColumn: To make a column a primary key, you need to use the @PrimaryColumn decorator.
- @PrimaryGeneratedColumn: To make column value auto-generated use @PrimaryGeneratedColumn decorator.

## Null and Undefined values in where cause conditions in TypeORM
- In TypeORM, calling Repository.findOneBy({ id: undefined }) returns the first row from the table, and Repository.findBy({ userId: null }) is unfiltered and returns all rows.
- By default, TypeORM skips both null and undefined values in where conditions. This means that if you include a property with a null or undefined value in your where clause, it will be ignored.
- For this set invalidWhereValuesBehavior in data-source file as throw value otherwise that problem will be there and you can't do anything in production.

## Entity
- Entity is a class that maps to a database table (or collection when using MongoDB). You can create an entity by defining a new class and mark it with @Entity().

## Embedded Entities
- suppose we have three entities name User, Employee, Student which has common column names which are firstName and lastName then we can define the base class or base entity with this common properties and use it like `@Column(() => Name) name: Name` in other entities this how it reduce the duplication.

## In order to reduce the duplication we can also use the inheritance in typeorm.

## Adjacency list
- Adjacency list is a simple model with self-referencing.
- We can use the @OneToOne, @OneToMany, @ManyToOne, @ManyToMany decorator for this.

## Nested Set
- Nested set is another pattern of storing tree structures in the database. It is very efficient for reads, but bad for writes.

## Materialized Path (aka Path Enumeration)
- Materialized Path (also called Path Enumeration) is another pattern of storing tree structures in the database. It is simple and effective.

## Closure table
- Closure table stores relations between parent and child in a separate table in a special way. It's efficient in both reading and writing.

## There are multiple methods to work with tree like structure. you can check it out on official doc under tree entities section.

## What is database view? 
- It is virtual table mainly used to store the queries result into that.
- mainly used not to expose the sensitive information of db and only expose the information that is required.

## ViewEntity()
- View entity is a class that maps to a database view. You can create a view entity by defining a new class and mark it with @ViewEntity().
- Take following options: 
    - name: define name of the view.
    - database: define the database name.
    - schema: schema name.
    - expression: view definition
    - dependsOn: List of view on which current view is depends on.
e.g. @ViewEntity({
    expression: `
        SELECT "post"."id" AS "id", "post"."name" AS "name", "category"."name" AS "categoryName"
        FROM "post" "post"
        LEFT JOIN "category" "category" ON "post"."categoryId" = "category"."id"
    `
})
- Each view entity must be registered in your data source options.

## ViewColumn
- To map data from view into the correct entity columns you must mark entity columns with `@ViewColumn()` decorator and specify these columns as select statement aliases.
- This decorator means this column value coming from view not from actual db table.
- View column also has options like column options has but only it has name and transformer option.

## Relation
- relation helps you work with related entities easily.
- One to One, One to Many, Many to One, Many to Many relations are there.
- TypeORM has decorators like: `@OneToOne`, `@OneToMany`, `@ManyToMany`, `@ManyToOne`.
- the syntax is like @ManyToMany((type) => Question, (question) => question.categories)
- In this example Question is another entity and it has categories column.
- But we also need to define the `@JoinColumn` in one to one, one to many, many to one in owner side.
- And we need to use the `@JoinTable` in many to many relation.
- We can also define the name of the column by specifying the { name: <set_name> } in join-column.
- We can also specify the referenceColumnName in join-column parameter that define the this column is referenced to which column. If we don't define then it is reference to the id of the another entity.
- You can also join multiple columns. Note that they do not reference the primary column of the related entity by default: you must provide the referenced column name.
- `@JoinTable` is used for many-to-many relations and describes join columns of the "junction" table.
- A junction table is a special separate table created automatically by TypeORM with columns that refer to the related entities.
- we can also change the column name or referenceColumnName as we do in join-column.
- The side you set `@JoinColumn` on, that side's table will contain a "relation id" and foreign keys to the target entity table.
- One to many cannot exists without many to one.

## Relations can be uni-directional and bi-directional. Uni-directional are relations with a relation decorator only on one side. Bi-directional are relations with decorators on both sides of a relation.

## How to decide which one is owner?
- in one to one any one can be owner.
- in many to one or in one to many many side is owner.

## Relation options
There are several options you can specify for relations:

- eager: boolean (default: false) - If set to true, the relation will always be loaded with the main entity when using find* methods or QueryBuilder on this entity
- cascade: boolean | ("insert" | "update")[] (default: false) - If set to true, the related object will be inserted and updated in the database. You can also specify an array of cascade options.
- onDelete: "RESTRICT"|"CASCADE"|"SET NULL" (default: RESTRICT) - specifies how foreign key should behave when referenced object is deleted
- nullable: boolean (default: true) - Indicates whether this relation's column is nullable or not. By default it is nullable.
- orphanedRowAction: "nullify" | "delete" | "soft-delete" | "disable" (default: disable) - When a parent is saved (cascading enabled) without a child/children that still exists in database, this will control what shall happen to them.
    - delete will remove these children from database.
    - soft-delete will mark children as soft-deleted.
    - nullify will remove the relation key.
    - disable will keep the relation intact. To delete, one has to use their own repository.

## Migrations
- Although typeorm can automatically generate the table from entity but it is not recommanded to do that.
- because in production it will cause error.
- So use migrations instead.
- `npx typeorm migration:create <path/to/migrations>/<migration-name>` this is the command to create new migration file manually.
- This command generate one file with two methods in it up and down which is used to up means migrate and down means revert
- `typeorm migration:generate -d <path/to/datasource> <migration-name>` command is used to generate migration file automatically.
- `npx typeorm-ts-node-esm migration:run -d src/data-source.ts` this is the command is mostly used if you are in esm as module not common-js
- `typeorm migration:generate -d ./src/data-source.ts ./src/migration/init` this is the generate command
- `npx typeorm-ts-node-esm migration:revert -d src/data-source.ts` this is the revert command
- `npx typeorm-ts-node-esm migration:show -d src/data-source.ts` this command will use to show migration history in which [X] means migration run and [] means migration is pending or any issue
- We can also run fake migration using --fake flag. this is useful when manual changes already made to database just need to add in migration history.

## Transaction in Migration
- By default, TypeORM will run all your migrations within a single wrapping transaction.
- This is due to --transaction all flag by-default
- Need of each single different transaction use --transaction each flag.
- No need of transaction --transaction none use this flag.
- We can also set this in MigrationInterface by using transaction variable with true or false

## One of the major advantage of transaction is if anything fails then everything is roll backed nothing should be commited in db.

## Common Problem while working with relation that is circular import in which one is depending one another is another is depending on one
## In this situation use the type import: for more information visit this doc reference of typeORM: [doc](https://typeorm.io/docs/relations/relations-faq/#avoid-circular-import-errors)

