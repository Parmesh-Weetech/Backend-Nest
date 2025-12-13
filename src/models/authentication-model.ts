export type Request = {
    url: string,
    headers: {
        authorization: string,
    },
    role?: string
};

export type APIResponse = {
    status: number,
    body: string
};

export const APIResponseClass: APIResponse = {
    status: 200,
    body: ""
};

export type DecoratorResponse = {
    // apiResponse?: APIResponse,
    target?: Function
}