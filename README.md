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

