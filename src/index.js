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
const myPromise1 = new Promise((resolve, reject) => {
    const n = Math.random();
    if( n > 0.5 ) {
        resolve('Success Promise 1! Number is ' + n);
    } else {
        reject('Failed Promise 1! Number is ' + n);
    }
});

const myPromise2 = new Promise((resolve, reject) => {
    setTimeout(() => {}, 2000);

    const n = Math.random();
    if( n > 0.5 ) {
        resolve('Success Promise 2! Number is ' + n);
    } else {
        reject('Failed Promise 2! Number is ' + n);
    }
});

Promise.allSettled([myPromise1, myPromise2])
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    }); 