"use strict";
// let data: Record<string, any> = {
//     user: {
//         name: "Alice",
//         age: 30
//     },
//     settings: {
//         theme: "dark",
//         notifications: true
//     }
// };
Object.defineProperty(exports, "__esModule", { value: true });
// console.log(data.user.name);
// function getName(cb: { (): void }): string {
//     cb()
//     return "Alice";
// }
function merge(arg1, arg2) {
    if (typeof arg1 === "number" && typeof arg2 === "number") {
        return arg1 + arg2;
    }
    else if (typeof arg1 === "string" && typeof arg2 === "string") {
        return arg1 + arg2;
    }
    else if (typeof arg1 === "number" && typeof arg2 === "string") {
        return arg1 + Number(arg2);
    }
    else if (typeof arg1 === "string" && typeof arg2 === "number") {
        return Number(arg1) + arg2;
    }
    return "Error: Arguments must be numbers";
}
console.log(merge(1, 2));
console.log(merge("hello", "world"));
console.log(merge(5, "10"));
console.log(merge("20", 30));
//# sourceMappingURL=index.js.map