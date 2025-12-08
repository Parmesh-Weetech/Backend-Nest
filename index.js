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

const obj1 = {
    name: "Max",
    age: 20,
    hobbies: ["Sports", "Cooking"]
};

const obj2 = Object.assign({}, obj1);
obj1.name = "Manu";

console.log(obj1);
console.log(obj2);

obj1.hobbies.push("Reading");
console.log(obj1);
console.log(obj2);