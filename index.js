const taxArray = [10.99, 12, 18.50, 15.75, 9.99];

const set = new Set(taxArray);
console.log(set);
console.log([...set]);

const map = new Map();
map.set('apple', 1);
map.set('banana', 2);
map.set(1, 'mango');

console.log(map);
console.log([...map]);
console.log([...map.keys()]);
console.log([...map.values()]);