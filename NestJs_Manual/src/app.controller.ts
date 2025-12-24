import { Controller, Get } from "@nestjs/common";

@Controller("/api")
export class AppController {
    @Get("/get")
    getRootRoute() {
        return "Hello World! I am here";
    }
}

