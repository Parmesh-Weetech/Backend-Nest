class User {
    constructor(id, name, age, number) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.number = number;
    }

    login() {
        console.log("User login")
    }

    signup() {
        console.log("singup");
    }

    generateAccessToken() {
        console.log("Access Token")
    }

    logout() {
        console.log("logout")
    }
}

class Account {
    constructor(accountNo, accountType, accountHolderName) {
        this.accountNo = accountNo;
        this.accountType = accountType;
        this.accountHolderName = accountHolderName;
    }

    createAccount() {
        console.log("Create account");
    }

    updateAccount() {
        console.log("update account");
    }
}

class Transactions {
    constructor(amount, transactionType, accountNo, accountHolderName) {
        this.amount = amount;
        this.transactionType = transactionType;
        this.accountNo = accountNo;
        this.accountHolderName = accountHolderName;
    }

    createTransaction() {
        console.log("create transaction")
    }

    updateTransaction() {
        console.log("update transaction")
    }
}