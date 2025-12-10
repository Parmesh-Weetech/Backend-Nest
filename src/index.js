// const taxArray = [10.99, 12, 18.50, 15.75, 9.99];

// const set = new Set(taxArray);
// console.log(set);
// console.log([...set]);

// const map = new Map();
// map.set('apple', 1);
// map.set('banana', 2);
// map.set(1, 'mango');

// console.log(map);
// console.log([...map]);
// console.log([...map.keys()]);
// console.log([...map.values()]);

// const user = {
//     5: "1",
//     1: "5"
// }

// const obj1 = {
//     name: "Max",
//     age: 20,
//     hobbies: ["Sports", "Cooking"]
// };

// const obj2 = Object.assign({}, obj1);
// obj1.name = "Manu";

// console.log(obj1);
// console.log(obj2);

// obj1.hobbies.push("Reading");
// console.log(obj1);
// console.log(obj2);

// class Person {
//     #name;
//     age;

//     constructor(name) {
//         this.#name = name;
//     }

//     get name() {
//         return this.#name;
//     }
//     static greet() {
//         console.log('Hello there!');
//     }
// }

// const person = new Person('Max');
// console.log(person.name.toUpperCase());

// get the user position
// const button = document.querySelector('button');
// button.addEventListener('click', () => {
//     navigator.geolocation.getCurrentPosition(posData => {
//         console.log(posData);
//     }, err => {
//         console.log(err);
//     });
// });

// Promise
// const myPromise1 = new Promise((resolve, reject) => {
//     const n = Math.random();
//     if( n > 0.5 ) {
//         resolve('Success Promise 1! Number is ' + n);
//     } else {
//         reject('Failed Promise 1! Number is ' + n);
//     }
// });

// const myPromise2 = new Promise((resolve, reject) => {
//     setTimeout(() => {}, 2000);

//     const n = Math.random();
//     if( n > 0.5 ) {
//         resolve('Success Promise 2! Number is ' + n);
//     } else {
//         reject('Failed Promise 2! Number is ' + n);
//     }
// });

// Promise.allSettled([myPromise1, myPromise2])
//     .then(result => {
//         console.log(result);
//     })
//     .catch(err => {
//         console.log(err);
//     });

// Synbols
// const sym1 = Symbol('key1');
// const sym2 = Symbol('key1');

// console.log(sym1 === sym2);

// const user = {
//     [sym1]: 'Max',
//     [sym2]: 'Manu',
//     age: 30
// };

// console.log(user);
// console.log(user[sym1]);
// console.log(user[sym2]);

// Iterators
// Create an array
// const arr = [10, 20, 30];

// // Get the iterator for the array
// const iterator = arr[Symbol.iterator]();

// // Use the iterator to access each value one by one
// console.log(iterator.next());  // { value: 10, done: false }
// console.log(iterator.next());  // { value: 20, done: false }
// console.log(iterator.next());  // { value: 30, done: false }
// console.log(iterator.next());  // { value: undefined, done: true }

// Generators
// function* myGenerator() {
//   yield 1;
//   yield 2;
//   yield 3;
// }

// const gen = myGenerator();

// console.log(gen.next()); // { value: 1, done: false }
// console.log(gen.next()); // { value: 2, done: false }
// console.log(gen.next()); // { value: 3, done: false }
// console.log(gen.next()); // { value: undefined, done: true }

const user = {
  name: "Max",
  age: 30,
};

// Reflect.defineProperty(user, 'gender', {
//     value: 'Male',
//     writable: true,
//     enumerable: true,
//     configurable: true
// });

// Reflect.deleteProperty(user, 'age');

// console.log(Reflect.has(user, 'name'));

// const userProxyHandler = {
//   get(target, prop) {
//     console.log(`Getting property ${prop}`);
//     return target[prop];
//   },
// };

// const proxy = new Proxy(user, userProxyHandler);

// console.log(proxy.name);
// proxy.age = 31;
// console.log(proxy.age);

// const fs = require('fs');

// fs.writeFile('info.txt', 'This is some info text.', (err) => {
//     if (err) {
//         console.error('Error writing file:', err);
//     } else {
//         console.log('File written successfully.');
//     }
// });

// fs.readFile('info.txt', 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading file:', err);
//     } else {
//         console.log('File content:', data);
//     }
// });

const http = require("http");
const express = require("express");

// const server = http.createServer((req, res) => {
//   let name = [];

//   req.on("data", (chunk) => {
//     name.push(chunk);
//   });

//   req.on("end", () => {
//     console.log(name.toString());
//     res.statusCode = 200;
//     res.setHeader("Content-Type", "text/html");
//     Buffer.concat(name).toString();
//     res.write(
//       `<h1>Hi, ${name}</h1><form method='POST' action='/'><input type='text' name='name'/><button type='submit'>Submit</button></form>`
//     );

//     res.end();
//   });
// });

// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}/`);
// });
