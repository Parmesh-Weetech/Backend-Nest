import { ProductController } from "../controller/ProductController";

export const ProductRoutes = [{
    method: "get",
    route: "/product",
    controller: ProductController,
    action: "all"
}, {
    method: "post",
    route: "/product",
    controller: ProductController,
    action: "save"
}, {
    method: "get",
    route: "/product/:id",
    controller: ProductController,
    action: "findById"
}]