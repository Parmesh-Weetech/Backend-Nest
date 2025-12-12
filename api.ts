import { Private, LoginRequired, Public } from './Decorators.js'
import type {
  privateRequest,
  loginRequiredRequest,
  publicRouteRequest,
} from "./models.ts";

// Using the decorators
@Private({
    url: "/admin",
    headers: {},
} as privateRequest)
class AdminRoute {}

@LoginRequired({
  url: "/api",
  headers: {
    authorization: "Bearer token",
  },
} as loginRequiredRequest)
class ApiRoute {}

Public({
    url: "/public",
    headers: {},
} as publicRouteRequest);
class PublicApi {}
