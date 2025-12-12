import { Private, LoginRequired, Public } from './Decorators.js'
import type {
    Request
} from "./models.ts";

// Using the decorators
@Private({
  url: "/admin",
  headers: {
    authorization: "Bearer token",
  },
  role: "admin",
} as Request)
class AdminRoute {}


@LoginRequired({
  url: "/api",
  headers: {
    authorization: "Bearer token",
  },
} as Request)
class ApiRoute {}


Public({
  url: "/public",
  headers: {
    authorization: "Bearer token",
  },
} as Request);
class PublicApi {}
