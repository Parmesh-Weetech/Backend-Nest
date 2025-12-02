## Clean code doesn't mean whether code is working or not but code should be easy to read and understand at first look.

### Clean code should be easy to understand and meaningful.
### should reduce the process of understanding.
### should be to the point
### should avoid complex names, large codeblocks, nesting block.
### should follow common best-practices and patterns.
### should be fun to write and maintain.

### Clean code doesn't require specific type declaration without type declaration we can also have clean code.

#### Clean code is for human not for a machine.
#### Clean code means how to write a code which is maintained, understandable but clean architecture means where to write which code.

## Naming convension of Variables, functions, classes, etc.
### Names should be meaningful not the random a, b, c.
### Names of a variable or function should directly tell what that variable means or what that function is doing

## There are multiple cases which is using by industry
1. camelCase - variable and functions - e.g. is_valid
2. snake_case - database fields - e.g. isValid
3. PascalCase - classes and components - e.g. User
4. kebab-case - url, files - e.g. side-drawer

### In Classes, the name of the class should follow PascalCase and should give proper explaination of that class or describe the class.
### Do not add redundant class suffix.
### Built-in class-names or functions-name do have exceptions in programming language.

### In Comments, If your code is readable and descriptive, you don’t need a comment.
### Comments are only for why you are doing something unusual or non-obvious.
### Do not add comments if it is misleading the working of code.
### Add comments if it is providing legal information, todo notes, warning, explanation which is not replace by good naming

### “Any fool can write code that a computer can understand. Good programmers write code that humans can understand” — Martin fowler

### In program do not use the words like kill, throw because this codes will read by many people. so do not use the code which will create any kind of problems to person, culture because that impact on person mind directly. Use the names like removeAll, deleteItem

### Do not add or need to add extra words to naming of variables, function, classes that doesn't necessary or helpful.

### Do not use slang, disinformation, unclear abbreviation to variable, class-name, or to the function-name.

### Always use distinctive names.

### Suppose if you want to get the users from db so you use fetchUsers or getUsers or retrieveUsers but then stick with it.

## Code Structure
### Put the code in order:
1. imports
2. constants / configuration
3. classes
4. helper functions
5. main code execution

### avoid repetition means if same logic appear twice make it into one function.

### Use constant space, indent, empty lines.

### Delete the code that is not in use do not comment that code always delete that code.

### Code formatting is also very crusial. There are two types of formatting 1. vertical and horizontal

### vertical formatting means gap between lines and it is important because it directly associated with readability of code and split code in files which has multiple concepts.

### Different concepts should be seprated and similar does not.

### related concepts should be closer to each other.

### Code formatting or ordering can be different as per language.

### In horizontal scrolling do not add so much big statements that person needs to scroll horizontly to see whole code and do not add long variable or function name that increase horizontal scrolling.

### Functions that are used first should appear earlier in the file.

### Functions that are helpers or less important should appear later.

### In Functions do not pass arguments that are not easy to understand or not obvious and unclear.

### If there are three arguments or more than three arguments then pass it with labels and take it as container where the function definition is there.

### We can use the spread operator if there are n numbers of parameters are there.

### Functions could not modify the incoming parameter and always send the request output.

### And in such case where incoming parameter is modified name that function clearly.

### Function body should not be more it should be clean containing less code.

### Good function are always a function that doing one thing means sperate one function body into multiple function based on level of abstraction.

### There are two level of abstraction high level and low level means suppose if one line is checking email is valid or not in js then that code is one line code but if particular lines are saving user in db then that is the high level so make new function for saving user and use that next to email validation line.

### But there is a way to write the high level and low level code where to write what

### Hight level function tells what to do not how to do

### Low level function tells how to do not what to do

### In clean code, all operations should be on same level is easier to understand. Mixing the code operations can lead to bad codes.

### Another rule is if two functions are doing two different things but we can create a one functions combining that two functions execution then do that because calling one functions is more easy and understand then two seprate. so means merge the related code.

### Use the global error handler for throwing and console.logging different error so no need to write this console.log again and again add it in function and then use it when needed.

### Seprating levels of abstraction can decrease the lines of code and easy to read.

### Always use the don't repeat yourself (DRY) principle because it helps to improve the codebase, readability, decrease the size of codes.

### Every piece of logic, knowledge should exists exactly once in codebase and whenever you need it reuse it. So, it helps if there is a change in multiple places then only need to change the one function or file and it is cleaner and shorter.

### But when doing the clean code use common sense also, bindly using this concept in cleaning code can increase readability.

### This rules are guidence or laws.

### There is a another concept of pure functions means function that takes input generate the same output that called as a pure function.

### Impure functions are less predictable and pure functions are more predictable. And pure functions doesn't have side-effects.

### Side-effect means that changes the state of program or system

### sending http request, console.log, create session all are side-effects but unexpected side-effects are bad and can cause problems.

### If the functions are impure then side-effect will be there but that should not be unexpected.

### Testing matters when writing code in order to give cleaner code which is readable, understandable, maintained.

### In if-else condition first rule of clean code is guard clause means in function starting checking for specific case that might throw error or return false and if that comes at the point exit from the function with proper error message or return statements. 

### Guard is very easy to read and understand.

### Another concept is fail fast means you detect the errors as soon as it happens and handle that because If you don't handle this then this error might cause some serious problems in future and by handling this error it improves the safety.

### Two if statement is better than nested if statements because nested if statements are less readable then two if statement.

### Don't catch exceptions or ignore errors can cause problems or bugs and can lead to some serious failure.

### Sometimes throwing none or null is valid instead of throwing errors if you are finding for something and not found. Return optional values for non-exception errors

### Use centralized error handling in order to handle errors every point which is same.

### Always provide a detailed error message if needs to throw proper error message.

### Do not put the so much code inside the try-catch

### Always use the factory functions.

### Factory functions are functions that are creating the objects, maps, or lists.  

### This factory function helps because if you want to change the implementation of multiple objects then you only need to change the one factory functions no need to change the entire code.

### Classes should do Single Reposibility Principle (SPA) means one class only do one thing not more than that because it is hard to manage then.

### If class is doing so many thing break them into different ones. Classes should be small and focused.

### Do not do deep inheritance in classes it makes hard to understand, and maintain for others.

### Keep methods of class should be small and should do one thing rather than big ones

### Give proper names to classes and methods of that class as discussed above

### Avoid large constructor functions of that class.

## The difference between Real Objects and data-structures

### real objects follows the abstraction means hiding properties and variables and only apis are public using which we can update the object properties.

### In data structures all things are public means no abstraction.

### Real objects follow abstaction, encapsulation, polymorphism, inheritence while data-structure cannot.

### data structure primary use is to store with primarily concerned with organizing and storing data.

### data structure cannot have that real world behaviour that object has.

### data structures focus on how to store, organize, and access data in an efficient way.

### Do not use this both in single codebase because every messy and hard to understand and maintain.

## Polymorphism:
### ability of an object to take many forms is called as polymorphism.

### Use polymorphism while working with classes because it solves lots of problems.

## Cohesion
### Cohesion means how much your class methods using the class properties
### If all methods are using all properties then it has high cohesion.
### If all methods are not using all properties then it has no cohesion.
### we always between this two. we do not have 100% high cohesion or 0% no cohesion.
### But we need the highly cohesion always and try for it.

## Law of demeter
### Objects should follow Law of demeter or we can say Principle of least knowledge means An object should only interact with its own methods, its parameters, or its direct collaborators. It should not interact with the internals of other objects or call methods on objects that are far away in the object hierarchy.
### The benefits are maintainable, loose couple, increase readability, flexibility.
### This objects should not talk to friends of friends.

## SOLID Principle