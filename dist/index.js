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
export {};
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
// function Logger(arg1: number, arg2: number) {
//   return function (target: Function) {
//     console.log("Logging...");
//     console.log("Target:", target);
//     console.log("Arguments:", arg1, arg2);
//     console.log(target.prototype)
//   };
// }
// @Logger(10, 20)
// class Person {
//   name: string;
//   constructor(name: string) {
//     this.name = name;
//     console.log("Person created:", this.name);
//   }
// }
// const person = new Person("Alice");
//# sourceMappingURL=index.js.map