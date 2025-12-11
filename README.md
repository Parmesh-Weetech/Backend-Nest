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