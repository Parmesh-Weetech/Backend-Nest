export type Request = {
  url: string,
  headers: {
    authorization: string,
  },
  role?: string
};
type APIResponse = {
  status: number,
  body: string
};

export const APIResponse: APIResponse = {
  status: 200,
  body: ""
};

export type DecoratorResponse = {
  // apiResponse?: APIResponse,
  target?: Function
}