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
- JS has special case where in conditions if you write non-empty string or non-zero number treated as true and 0 or non-empty string treated as false.
- But empty objects, arrays treated as true.
- null, undefined, NaN treated as false.
- So, In js what is happening is in condition if there no true or false values then js try to convert it to the true or false values.
- JS has explicit and implicit type conversion
- conversion means explicit type conversion and implicit means coercion