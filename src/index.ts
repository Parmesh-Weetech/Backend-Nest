import * as express from "express"
import * as bodyParser from "body-parser"
import { Routes } from "./routes"
import { AppDataSource } from "./data-source"

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
}).catch(error => console.log(error))