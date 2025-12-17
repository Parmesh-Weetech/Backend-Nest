import express from "express"
import bodyParser from "body-parser"
import AppDataSource from "./data-source.js"
import { UserRoutes } from './routes/UserRoute.js'
import { ProfileRoute } from "./routes/ProfileRoute.js"

export const Routes = [
    ...UserRoutes,
    ...ProfileRoute
]

AppDataSource.initialize().then(async () => {
    const app = express()
    app.use(bodyParser.json())
    // register all routes from Routes
    Routes.forEach(route => {
        ; (app as any)[route.method](route.route, (req, res, next) => {
            const result = (new (route.controller as any)())[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(data => data !== undefined && res.send(data)).catch(next)
            } else if (result !== undefined) {
                res.send(result)
            }
        })
    })

    app.listen(3000)
    console.log("Express server has started on port 3000")

    // const dataSourceOptions: DataSourceOptions = AppDataSource.options
    // log(dataSourceOptions) // prints the datasource option which we given to it in data-source.ts file.

    // log(AppDataSource.isInitialized) // tell whether data-source is initialized or not.

    // log(AppDataSource.driver) // give underlying drives that is in use with this project

    // log(await AppDataSource.manager.find(User)) // fetches the users information

    // await AppDataSource.synchronize() // synchronize the table with current model schema. If there is any changes in mdoel it will update the table.

    // provide a single transaction where multiple database can perform their operations.
    // await AppDataSource.transaction(async (manager) => {
    // NOTE: you must perform all database operations using given manager instance
    // its a special instance of EntityManager working with this transaction
    // and don't forget to await things here
    // })

    // await AppDataSource.query("SELECT * FROM user") // perform raw sql queries operations

    // await AppDataSource.createQueryBuilder().select().from(User, 'user') // used create a query builder which mainly used to build queries

    // const queryRunner = AppDataSource.createQueryRunner()
    // await queryRunner.connect(); // Creates a query runner used to manage and work with a single real database dataSource.


}).catch(error => console.log(error))