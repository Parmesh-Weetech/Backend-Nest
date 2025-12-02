class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    getData() {
        return this.name + " - " + this.age;
    }
}

function combinePersonInformation(p1, p2) {
    let combinedInfo = p1.getData() + "|" + p2.getData();
    return combinedInfo;
}

let personOne = new Person("Tom", 22);
let personTwo = new Person("Lia", 19);
let combinedPerson = combinePersonInformation(p1, p2);

console.log(combinedPerson);