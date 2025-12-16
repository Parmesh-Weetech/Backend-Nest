import * as express from "express"
import * as bodyParser from "body-parser"
import { ProductRoutes } from "./routes/ProductRoute"
import { UserRoutes } from './routes/UserRoute'
import { AppDataSource } from "./data-source"

export const Routes = [
    ...UserRoutes,
    ...ProductRoutes,
];

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
}).catch(error => console.log(error))