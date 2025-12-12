## TypeScript is just a extra features with JS as we know. It simply added giving extra types to assigned variables, functions arguments and to its return type, etc.

- JavaScript also has features to give type to variables but not the explicit type.

- TypeScript has special type which is `{}` this simply means any type except null or undefined.

- Literal types are very useful in typescript it just gives you a way to define only the important direct value as a type to the variable or function.

- We can also use function as type in typescript.

- There are two most useful operator when there is a null or undefined values
1. ! and 2. ?

- First operator tells that I know that this variable or this part of code should have null values but for this line or variable it never be a null value or it never contains null values.
- Second operator tells that I know that this variable or this of code can hold undefined or null values but only go ahead with the next line which is depends on this if this line is not null or not undefined.

- There is a another type casting thing in typescript using `as` keyword
- Using this we can cast the type from one type to another.

- Nullish coalescing operator or ??
- this is used to tell that only returns a values of right side if left of this operator is null or undefined.

## Generating tsconfig file
- We can generate tsconfig file by firing command: `tsc --init`.

- If you want to enable tsconfig file to check the whole project means all files then need to fire the command: `tsc` only no file name require.

- We can also enable the watch mode by firing command: `tsc --watch`.

- This will constant watch our folders and automatically generate the js files.

## Classes in TypeScript
- In typescript, we can create a class as we can create in javascript but there is an extra feature that is `constructor parameter properties` means in typescript, it is require to create variable before assigning some values in constructor function
- now the constructor parameter properties means we can directly using public variable_name: type in constructor of a class in typescript and it will directly create a variable that we want this is not available in JavaScript.

## Access Modifiers in TypeScript
- There are three access modifiers: Public, Private, and Protected.
- These keywords are not available in JavaScript because typescript explicitly adds this to provide the public, private, and protected variables to specific class.

## readonly properties
- we can also define any properties as readonly properties means that cannot be changed.

## Setter and Getters
- We can use the getters and setters also in order to set and get the values of variables from class especially the private variable values.

- One more feature that is not available in JavaScript but present in TypeScript which is abstract class

## abstract class and methods
- abstract class is a class that doesn't have any method implementation but it provides just a function name and paramter that function can have.
- Every other class which is related to that should have to extend this abstract class and should have to implement this method in order to provide the feature.
- Methods can be abstract but we have to implement this whenever we extends this class
- Methods can not be private if it is abstract method and private method cannot be abstracted.

## Interface
- this is also a typescript feature which is not provided by javascript
- Interface mostly used to define the object type but there is a type declaration is also there.

## The difference between type declaration and interface
- the main difference between this two is declaration merging means we can define the interface with same name more than one time but typescript simply do that it will merge this all into one final one so we can define as many interface with the same name again and again.
- But most of the time the type declaration is used instead of interface.

- Interface inherit interface by using `extends` keyword.
- Class inherit interface by using `implements` keyword.

- We can merge this type declaration using intersection or `&` symbol this will merge two type declaration into one.

## Index Signature
- the syntax is `type D = { [key: string]: any;};`.
- this allows object to have any number of properties, and here is the type of their keys and values.

## `as const` keyword
- this is a keyword that is there in typescript only not in javascript
- this mostly used when we want to make the fields readonly means not editable.

## Generics
- Generics in TypeScript are a tool for creating reusable, flexible, and type-safe components that can work with a variety of data types, rather than a single specific one.
- generics is about combination of multiple types.
- generics is about working flexibly with different types.
- generics means it can work with many types but still maintain type-safety.
- allow to make component re-useable
- help typescript to understand the return type also.
- Generics is most useful and important feature that typescript has along with type declaration and interface with classes.
- We as a developer can handle n number of posibilities of having n number of user input and return type.

## Generics Constraints
- generics constraints means creating flexible function or class that has many types but not all types. So, this means setting the constraints.
- Using generics constraints we can you limit what types a generic can accept, so that typescript got to know that what are the properties and methods I can apply to this arguments.

- Generics can be also used in classes and interfaces.
- Generics in classes and interfaces lets you define reusable structure that can hold user defined types at run-time.
- But it keeps the typescript safety.

## Decorators
- decorators are functions that can be added to the functions, classes, properties which adds a extra feature, behaviour, meaning, power to them.
- Decorators defined using the `@` symbol.
- This functions are getting called at run-time no at compile-time.
- Decorator must returns function which is decorator function otherwise it returns an error.
- We can also pass arguments to the decorator also but make sure it follow above line.
- Decorator does change the behaviour or what the class, function, property is doing but mostly it will be not.
- We can't use the decorators directly in simple function or variables. It is a OOP concept and it has to be used in some class
- Function decorator executes first and then class decorator because class is initialized after method which is inside that class.
- Order matter while creating decorator for class, methods, and variables because sometime we want one decorator answer input for other or other decorator is depending on previous one.
- Decorators has two kinds: Experimental and ECMAScript Decorator
- Experimental Decorator is already in TS
- ECMAScript Decorator is added to JS in es2022 version.
- We can also pass the arguments to the decorator but for this we need to wrap the decorator into another function which takes the arguments which is passed into decorator and inner function take target field, context field. This is called decorator factory which is used to define a decorator function.
- Experimental Decorator are mostly used in many framework and libraries like Angular.Js, or in backend framework Nest.Js.
- We can define multiple decorator to single class, function, variable but the order to bottom-top means last decorator is there in declaration that executes first then upper-ones.
- But factory decorator order is which they are there in declaration order means top-bottom order.

## ES Modules
- ES modules are introduce in 2015 in es6 version of ECMAScript
- Which means we can use the import and export statements in files and divide the one project into multiple file.
- Before this namespace is used but now namespace is not used mostly but es modules is used.
- For this we need to specify the type in package.json as module.
- In importing files in another file we need to specify the type of the file whether it is a js file or ts file because browser won't know which file needs to import and use.