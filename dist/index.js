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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// console.log(data.user.name);
// function getName(cb: { (): void }): string {
//     cb()
//     return "Alice";
// }
// function merge<T, U>(arg1: T, arg2: U): number | string {
//     if(typeof arg1 === "number" && typeof arg2 === "number") {
//         return arg1 + arg2;
//     } else if(typeof arg1 === "string" && typeof arg2 === "string") {
//         return arg1 + arg2;
//     } else if (typeof arg1 === "number" && typeof arg2 === "string") {
//         return arg1 + Number(arg2);
//     } else if (typeof arg1 === "string" && typeof arg2 === "number") {
//         return Number(arg1) + arg2;
//     }
//     return "Error: Arguments must be numbers";
// }
// console.log(merge(1, 2));
// console.log(merge("hello", "world"));
// console.log(merge(5, "10"));
// console.log(merge("20", 30));
// Decorators
function Logger() {
    console.log("outer login...");
    return function (target) {
        console.log("Logging...");
    };
}
function AnotherDecorator() {
    console.log("outer another decorator...");
    return function (target) {
        console.log("Another decorator executed.");
    };
}
let Person = class Person {
    name;
    constructor(name) {
        this.name = name;
        console.log("Person created:", this.name);
    }
};
Person = __decorate([
    Logger(),
    AnotherDecorator()
], Person);
const person = new Person("Alice");
export {};
//# sourceMappingURL=index.js.map