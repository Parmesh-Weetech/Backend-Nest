class Exam {
    createPaper() {
        console.log('create paper')
    }

    writePaper() {
        console.log('write paper')
    }
}

class Student extends Exam {
    createPaper() {
        throw new Error("cannot create paper as I am student")
    }
}

class Teacher extends Exam {
    writePaper() {
        throw new Error("Cannot write paper as I am the teacher")
    }
}

class CreatePaper {
    createPaper() {
        console.log("create paper")
    }
}

class WritePaper {
    writePaper() {
        console.log("write paper")
    }
}

class Teacher extends CreatePaper {
    createPaper() {
        console.log("create paper")
    }
}

class Student extends WritePaper {
    writePaper() {
        console.log("write paper")
    }
}