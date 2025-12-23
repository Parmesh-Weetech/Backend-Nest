export const userRoute = ["/admin/user/create", "/admin/user/update", "/admin/user/get/all", "/admin/user/get/:id", "/admin/user/delete/:id"];

export const roleRoute = ["/admin/roles/create", "/admin/roles/update", "/admin/roles/get/all", "/admin/roles/get/:id", "/admin/roles/delete/:id"];

export const permissionRoute = ["/admin/permissions/create", "/admin/permissions/update", "/admin/permissions/get/all", "/admin/permissions/get/:id", "/admin/permissions/delete/:id"];

export const ROUTE_PERMISSIONS: Record<string, string[]> = {
    "POST /post": ["CREATE_POST"],
    "PUT /post": ["UPDATE_POST"],
    "DELETE /post": ["DELETE_POST"],
    "POST /user": ["CREATE_USER"],
};
