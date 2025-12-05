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
