class Student {

    constructor(name, age, email) {
        this.name = name; this.age = age; this.email = email;
    }

    getStudentInfo() { 
        return this.name + "-" + this.age + "-" + this.email; 
    }
}

class SubjectMark {
    constructor(subject, marks) {
        this.subject = subject; this.marks = marks;
    }

    getSubjectMarks() { 
        return this.subject + ": " + this.marks; 
    }
}

function getStudentMarks(student, subject) {
    let result = student.getStudentInfo() + " | " + subject.getSubjectMarks();
    return result;
}

let studentOne = new Student("Alice", 30, "alice@mail.com");
let studentTwo = new Student("Bob", 25, "bob@mail.com");

let subjectMarkOne = new SubjectMark("Math", 95);
let subjectMarkTwo = new SubjectMark("English", 88);

let studentOneMarks = getStudentMarks(studentOne, subjectMarkOne);
let studentTwoMarks = getStudentMarks(studentTwo, subjectMarkTwo);

console.log(studentOneMarks);
console.log(studentTwoMarks);

let students = [studentOne, studentTwo];

for (let i = 0; i < students.length; i++) { 
    console.log(students[i].getStudentInfo()); 
}
