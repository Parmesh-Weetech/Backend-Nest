## JS is weakly typed, dynamic, most prominent, hosted language.

- JS mostly works on engine in browser that engines are V8 of chrome, SpiderMonkey of firefox.
- In browser, engines first parse the code, then convert this code into machine code, and then last executes this codes.
- This all above process happens on single thread. 
- JS mainly developed to work at browser side not the server side.
- JS can easily works with HTML, CSS, even can send the HTTP request but also it has some limitations.
- JS can't access the local file system because if it can then every browser can easily read your files.
- JavaScript used the features and rules of ECMAScript. We can say JS is a implementation of ECMAScript standards.
- JS was originally developed to work in browser only.

- In JS undefined is a type itself and null is an object by default.

- There are two most important keyword in html while working with standalone html and js and that keywords are `defer` and `async`
- This both keywords are used to download the scripts along with js but there is a difference in working between them
- If your script rely on html then recommended to use the `defer`.
- When scripts are completely independent then you can use the `async`.
- But both the keywords will not work if there is a inline scripts means js in html file in between script.

## Debugging the JS
- We can highly use the chrome developer tools to efficiently debug the code if there is a logical, syntax or language related errors any kind of error.

## Truthy values
- JS has special case where in conditions if you write non-empty string or non-zero number treated as true and 0 or empty string treated as false.
- But empty objects, arrays treated as true.
- null, undefined, NaN treated as false.
- So, In js what is happening is in condition if there no true or false values then js try to convert it to the true or false values.
- JS has explicit and implicit type conversion
- conversion means explicit type conversion and implicit means coercion.

## Labels are the most important thing in js mostly working with loops
- Used when we have nested loops and we want to stop outer loop after some iteration using inner loop.
- In order to provide a labels the syntax is `label_name:`.

## Browser compilation of JS
- Browser has special engine called V8 engine that the main thing which interprete and compile the code
- Compiler is Just in time compiler
- Interpreter gives a byte code to the compiler and compiler then execute it and it doesn't re-compile the already compiled code if it doesn't changed.
- V8 is written in C++.
- The interpreter name is Ignition and the compiler name is turbo fan.
- And it use just in time compilation means it compiles, optimizes, and executes code on the fly.
- Just in time compiles at runtime, startup time is much faster, runtime optimization is adaptive, best for dynamic language.

## There is a another thing just like JIT which is AOT means Ahead Of Time which just executes the JS in advanced or ahead not in runtime.
- Angular use this AOT or ngc compiler.

## Browser has two concept that is heap and stack.
- Browser does the memory allocation that is heap. The long term data stored in heap.
- Stack is used to manage the flow which request comes in and goes out. Same for return values. Stack is short term memory.
- Using stack JavaScript engine basically keeps track of how currently going and happening in system.
- Stack follows the LIFO Property means Last In First Out.
- Premitive type variable stored in stack.
- All objects type variables are stored in heap.

## The heap memory managed by garbage collection of JavaScript.
- JS engine checks is there any objects which is free not in use and if found then it simply remove that this is called garbage collection.
- Suppose there a object which is not in use but still referencing to somewhere then js thinks you need this and won't remove that so that objects are known as memory leak.

## Function and Method
- There is a difference between functions and method
- Method is belongs to objects where functions are not.
- Method called using object_name.method_name where functions called using directly with its name.

## Function declaration and Function expression
- Function with name is called function declaration and function output stored in variable and function which is without name that called as function expression
- function expression best example is useeffect call-back function.
- Function declaration hoisted on top where express is hoisted but not initialized.

## Spread Operator and Rest Operator
- spread operator is used when we want to destructure existing objects or array to new one.
- Rest operator is mostly used in functions paramter where we don't know the number of parameter that are coming.
- When there is a rest operator do not pass any paramter after the rest operator because rest operator will take all passing arguments.

## If you don't pass any arguments then JavaScript has default `argument` keyword which contains all arguments. If you don't want to use the rest operator then you can use this.

## What are iterable?
- object that implement iterable protocol and has @@iterable method that called as iterable.
- Simple definition is objects on which you can use the for...of loop.
- An object is considered iterable if it implements the Symbol.iterator method.

## What is the difference between splice and slice method?
- slice method extract the portion of an array into new one means it doesn't affect the original array.
- While splice method doesn't extract the portion but change the original array.
- splice method is used to replace, add, delete an element from an array.
- Due to this behaviour splice is called as destructive and slice is non-destructive method.
- Slice takes two arguemtns first is starting index and second one is end index in which start index is included but end index doesn't.

## The difference between push, pop and shift, unshift method?
- push and pop method treat an array as stack and shift, unshift treat method as queue.
- that's why using push and pop elements removed or add from back or from end of an array where using shift and unshift elements are added or removed from start.

## The concat method
- If you want to add add to another array then we can use this method and it takes array as an arguments and return new concat array.

## IndexOf and LastIndexOf methods
- If you want to search something in array then you can use this methods
- indexOf method takes search element to search in array an start searching from starting position which is 0 if you doesn't specify the starting position to search.
- lastIndexOf method takes search element to search in array an start searching from last position of an array if you doesn't specify the position to search.
- indexOf starting from left to right where lastIndexOf starting from right to left.
- Both methods returns -1 if it doesn't find any matches index.

## The find and findIndex method
- In order to find an object whether it is a part of an array or not then we can use the find and findIndex method.
- find method finds the object and return it and findIndex find the index and then return that index values this is the difference between find and index method.

## Includes method
- We want to return true of false whether that element is included in array or not then we can use the includes method.

## split and join method
- If you want to split a string into array then use split method.
- If you want to join the array into single string values then you can use the join method.

## You can use the array destructuring if you have n numbers of array elements and want specific list of them into variables.

## Objects shallow copy problem
- Suppose you have an object with three properties name, age, hobbies where name is type of string, age is number, and hobbies is type of array.
- Now you created a another object using spread operator.
- Now you changed objects one person age so second object person age doesn't change.
- But if you changed object one person hobbies array then it change the second object person hobbies also matches object one hobby array.
- This is called shallow copy problem or we can top level spread operator copy problem.

## Object destructuring
- We can also destructure the objects but has to give a name exacting same as key is there in object.

## This keyword
- this is a special keyword that refers to its calling object.
- this is mostly used to modify the current object properties with specific operation.
- Sometimes this can be very complex or hard to debug and manage.
- Sometimes when you destructure the method that has this keyword use can cause problem because in this case this keyword refers to the global window object and that global window object doesn't have that properties and method which is refers to this.
- In this case we need to use the call, apply, or bind methods of js.
- The difference between call and apply is only that call method takes arguments as individual, seprated by commas and apply takes it as array.
- The call and apply method invokes immediately.
- The bind method returns a new function without executing the original. The new function is permanently bound to the specified this value.

## This keyword weird behaviour
- This keyword behave very weird with both arrow function and normal function.
- This depends on where to use which one.
- generally normal function is defined to declare in objects and arrow functions is defined to declare in loops or call-backs.
- So, this context is depends on who is calling the normal function and where the arrow function is declared.

## We can use the getters and setters to get and set the properties values to the object. Getters and Setters are the build in JavaScript methods to do it.

## Static methods
- static methods are the methods that don't need the objects to call them because that static methods are called as class utility methods or we can say that same for all objects that's why this kind of static methods can be called directly without need of objects.
- static methods stored directly on class not on class prototype.

## Access Modifiers in JS
- private variable or methods are defined using # symbol ahead of the name.
- protected variable or methods are defined using _ symbol ahead of the name.
- public variable or methods doesn't require any symbols.

## What is constructor functions?
- When we create a class object behind the scene it create a function with class_name as function_name and properties and assign the values to function properties that we have passed to that class object including that functions.
- But the inner magic is happened when we use the new keyword because when we use new keyword when we are creating the new object that new keyword create this constructor function with empty this object and assign the properties and values as well as functions to them.
- So this class keyword or syntax is just syntactic sugar we can say.

## Closures
- closures are can be most important topic sometimes in js.
- closures means when a inner scope remembers the state of outer scope / function even after outer scope / function completes its execution.
- This is because of JS lexical scoping means in js function remembers where they are created not when they are created.

## Prototype
- prototype is a object that used to share the properties, methods to other objects.
- prototypes are the mechanism by which objects can inherit properties and methods from other objects.
- Every JS object has this prototype which is refers to another object.
- When we create a method in class or constructor function it goes in prototype and when we call that method JS first look in object if it doesn't found it goes to the prototype chain and which ever object it found returns it but if doesn't found then it returns null.
- The last object in which JS looks is global object named `Object`.

## Why static methods are not in prototype chain or object?
- Static methods are belongs to the class or constructor function not to the prototype chain and hold special meaning because static methods are mainly used for utility methods and factory function
- Static methods are attached to class not to instance.

## The difference between prototype and __proto__?
- When we create a class or we can say constructor function then that class gets `prototype` and when we create a object for that class then that object gets `__proto__` which is links to that `prototype`.

## IIFE - Immediately Invoked Function Expression
- This kind of function invoked immediately once defined and don't need to call it from anywhere else.
- Using this function we can have encapsulation with prevent local variable to access from global scope.

## Numbers in JS always floating point numbers even integer numbers like 1, 2, 3 stored as 1.0, 2.0, 3.0.

## Numbers without decimal places doesn't exists in js.

## Numbers are stored as 64 floating numbers means numbers have 64 bits containing 0 or 1 where first bit represents the sign of that number whether it is a negative or positive.

## BigInt
- JavaScript has some limit to represent the number with or without floating points and if we want to work with larger than that numbers then we need the larger container to handle that for this use we have bigint or big integer
- BigInt is used to handle the number with or without floating points
- We have declare bigint number using `n` at the end of numbers like `123456789101231224123453n` <-- this is bigint.
- JS stores and manage bigint as string
- BigInt is can be negative numbers.
- BigInt doesn't have decimal places. If you declare you get an error.
- We can perform all operations like +, -, *, / with bigint but cannot mix integers with bigint if do so get error.
- BigInt works perfectly with =, -, /, * operations but we have any decimal place answer while working with this operations then js will simply cut-off decimal places like we do 5n / 2n then we got 2n instead of 2.5n.

## The Single-threaded JavaScript and Event loop
- JavaScript is single-threaded but javascript doesn't block the execution of code as we know using the event loop
- For more information about event loop: read this article [Event loop explained by Parmesh Bhatt](https://prmes119.hashnode.dev/from-v8-to-event-loop-the-inner-anatomy-of-nodejs)

## Handling promise with .then() and .catch()
- when we want to get whether the promise is rejected or resolved we have to use the .then and .catch
- But the orders matter when we have multiple promise together and we have multiple .then and .catch blocks because
- suppose we have three promise so as per theory we need 3 .then and 3 .catch methods but the orders matters
- because if 2nd promise gives errors so go to the second .catch block but suppose we have 1st promise .then and .catch block after that 2nd promise .then and .catch so 2nd promise gives error goes to 2nd .catch but after that 3rd promise .then will be executed.
- in order to prevent this need to have 3 .then but only one .catch method in the end that catches all promise error and won't executes anything which is there in any .then blocks of any promise.