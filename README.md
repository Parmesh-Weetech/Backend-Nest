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

## Promise methods
- `all` waits for all promise to resolve if any gets rejected then all rejected.
- `allSettled` waits for all promise to resolve or rejected.
- `race` waits for first promise to resolve or reject. The first Promise to resolve or reject wins the race.
- `any` resolves as soon as any one promise gets resolved if all promise gets reject then it throw error named AggregateError.

## Modules in JS or Deviding single files into the multiple
- whatever code you write in multiple file as a single module it getting parsed only once after that js executed in browser so if you have single console.log in file to see how many times it runs then it only one time whether it is a dynamic import or static import, named import or default import.
- This modules runs in strict mode so this keyword values always undefined

## Formatting and webpack with serve package environment
- For formatting and checking code quality we can use the prettier and eslint which is most powerful and enough to handle large projects as well.
- webpack is static module blundler which blundle the n number of file in most optimized production ready file structure that you can use to deploy on server.
- serve is a package on npm that used provide a small production type environment on your local system.
- You can setup this all on your system by following official guide.

## Symbols
- Symbols is simply premitive data type introduce in ECMAScript 6 version to represent the unique and immutable values.
- Symbols cannot mutable because it only exists for that specific window means If you reload the window or do refresh then that symbol will be deleted and new one is created.
- Symbols is like secret key which is guaranteed to be unique.
- Inorder to store the symbols for specific time period need to store it in database or in local-storage of browser.
- There are also pre-build symbols in js that can be used.

## Iterator
- Iterator is a JS object that allows you to access the element of a collection one by one we can use this iterator with loops.
- Every iterator must have to implement the `next()` method because without it iterator doesn't work.
- Next method has two things value which has current iteration values and done boolean paramter that holds false or true value based on iteration is completed or not.

## Generators
- generators are a special type of function that allow you to pause and resume execution, producing a sequence of values over time.
- useful for handling asynchronous operations, managing state, and working with large datasets in a more memory-efficient way.
- Syntax is `function* <function_name>` so that `*` is important otherwise it treat that function as normal function.
- Generator can pause its execusion at any time with using the `yield` keyword.
- It also use the next function so whether it is a generator or iterator that next function is very important.
- This Iterator and generators sometimes can be confusing due to its complexity.

## Using this iterator and generators we can build our own looping logics.

## The difference between return and yield?
- return is used in normal function and used to return the final output after that function execution is terminated. So, if you call the function another time then new execution is started.
- yield is used in generator function and used to return the current state values to its caller and can be resumed once call by next method.

## Reflect API
- Reflect added to JS in ES6 version 2015.
- reflect is a object that contains add, update, delete, get methods that can be helpful while working with objects.
- It becomes so much easy to work with object using reflect apis.
- There is Object API is there also but many methods are not there in Object API which is there in Reflect API.
- In Object API many methods might throw unwanted response on error that not able to handle on client side.
- Reflect is a toolbox for working with objects in a safe and consistent way.

## Proxy API
- proxy is object that wrap other objects.
- proxy will trap the object and modify its properties, get the properties, etc.

## What is the difference between reflect and proxy?
- proxy is a guard in between js and we as user and let you decide what to do with specific case in-between this.
- reflect is just normal function or object operation.

## How to protect the code?
- The thumb rule is don't send or store the important information on the client side because If you do so then there is no way for you save it from hackaers to steal your information.
- So keep that files, codes on server side and then hacker / other user cannot see it.

## XSS Attack
- One of the most dangerous attack is XSS which is called cross side scripting attack.
- In this XSS attack, any malious code can be inserted into the client side script to get the user related information, database information, prevent sending request from client to server instead of that sending request to that hackers server and eventually hacker can get the information.
- This XSS attack can be fixed using npm package named `sanitize-html` which will prevent this kind of XSS or cross side scripting attacks or there is a another way which is do not use `innerHTML` while working with html and js use `textContent` instead of that.
- This XSS attack can lead to various consequences, such as account compromise, account deletion, privilege escalation, malware infection, and many more.

## Types of XSS
1. Reflected XSS
- means one hacker is there and hacker found website in which hacker can add this malicious script using which hacker can get the users information. After that every time any user visit this website that users cookies, sessions, information goes to that hacker.

2. Stored XSS
- means malicious codes are stored in database and once you visit that software or website hacker steal that information.

3. DOM-Based XSS
- In this hacker will manipulate the DOM and steal your information.

## How to prevent this kind of attack?
- 1. enable CSP - Content Security Policy to prevent this kind of attack.
- 2. use dompurify package to prevent dom-based xss attack
- 3. use textContent instead of innerHTML.

## Before using any library or package if that package of library is open-source then check its source code and if you found any malicious like accessing dom or localStorage then do not use it

## CSRF attack
- another most dangerous attack is CSRF cross origin resource foregy
- means you visit any website login to your account then visit any malicious website which sends the request to that same backend server endpoint so browser send cookie with it also now backend server thinks cookies are there so this is a valid request so don't stop it and that hacker can now perform any kind of activity with your account.

## How to prevent this?
- use the csrf token - we need to generate the csrf tokens whenever user log into their account.

## CORS attack
- CORS means only frontend pages from myclient.com can read API responses.
- CORS means from which ever location the page is generated to that domain, port, protocol this web-page can make request other to not this is called CORS.

## What happens when client send a request to server - CORS?
- CORS simply meaning Cross Origin Resource Sharing
- 1. When client make a request to server
- 2. server check whether this client endpoint is allowed to fetch the data and make changes to db or not
- 3. If yes then sends the `Allow-Control-Allow-Origin` as true, or site url
- 4. now client checks its and if it is allowed then it display the data otherwise not.
- When browser first request to server automatically it adds the origin option along with request.
- If server don't allow then we get the CORS error.

## Why browser first send the OPTION request then?
- When there is a request made by browser it has to be have simple methods like GET, HEAD with no custom headers and with content-type should be form-urlencoded, multipart-file, or plain text
- Other than this anything is there browser first send the OPTION request for checking whether this request is allowed or not if server allows then send the actual request that's why we have OPTION request first.
- This OPTION request is called preflight request which means asking for permissions to send request.

## SQL Injection
- SQL Injection means hacker manipulate the sql queries by injecting malicious sql queries that can harm the data, steal the data.
- This happens when server doesn't verify or validate the user input and directly enter into the db records. So, It is recommended to perform server side validation also of user input data.

## To Prevent this SQL Injection
- use prepared statements
- Limit database privileges means only some user grant the permission to delete, edit the table record.

## DoS Attack
- Suppose one server has limit to handle the request upto 100 now once 101 request come server said unable to handle this request or resource not available.
- Now this is common but what if one single user sending that all 100 request once at a time so all server resource is occupied in single resource this is called DoS - Distributed of Service

## The another version is DDoS - Distributed Denial of Service
- In this hacker hacks the n number of system and from that system make n numbers of request so it become n * n numbers of request to that server which is so much larger than server capabilities to handle.

## How to prevent this DoS and DDoS attacks?
- Restrict the number of request that server can accept from specific IP in specific timeframe.
- 