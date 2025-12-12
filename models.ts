export type privateRequest = {
  url: "/admin",
  headers: {
    authorization: "Bearer token",
  },
};

export type publicRouteRequest = {
  url: "/public",
  headers: {},
};

export type loginRequiredRequest = {
  url: "/api",
  headers: {},
};
