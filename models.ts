export type Request = {
  url: string,
  headers: {
    authorization: string,
  },
  role?: string
};