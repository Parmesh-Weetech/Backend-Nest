import { csrfSync } from "csrf-sync";

export const {
    csrfSynchronisedProtection,
    generateToken
} = csrfSync({
    getTokenFromRequest: (req) => {
        return (
            req.headers["x-csrf-token"] ||
            req.body?._csrf
        );
    }
});
