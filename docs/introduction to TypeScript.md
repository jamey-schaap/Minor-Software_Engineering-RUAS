> **Learning goals**
> After reading this chapter, the student will be able to:
> - ... .

## Introduction to TypeScript
In the old days, there was JavaScript in the browser. JavaScript was the only way to add some degree of intelligence and logic to web applications on the client side. From form validation in real-time, to more sophisticated functionality that makes web applications feel a lot more like desktop applications, JavaScript became incredibly popular.

For this reason, the old days sucked badly. JavaScript was a poorly designed language, slow, filled with unusual inconsistencies such as two ways to say that something is not there (`null` and `undefined`, I am looking at you!). As recent releases of JavaScript made it better by introducing more and more standard features of modern programming languages, such as better scoped variable declaration, lambdas, etc., big applications were still suffering from the biggest missing functionality: static types. A long time ago (2012), Microsoft published TypeScript. A fully open source programming language with just one clear, explicit goal in mind: add types to JavaScript. The task was not simple at all, because JavaScript has to deal a lot with API communication and unstructured JSON data, and traditional type systems (let's say à la Java or C#) would not be able to correctly capture the subtlety of the way unstructured JSON is parsed into safe types known at compile-time. The common usage of formatted strings for routes also made this challenge extra complicated.

> Not even languages such as Haskell or F# with their advanced type systems were cut for the job. Something new and more powerful was needed.

TypeScript started off with a clean slate. On top of a simple, traditional type system (the sort of thing that says that it's not ok to pass a `string` to a function expecting a `number`), more and more advanced types were added, but always in a way that would be at the same time theoretically impeccable as well as elegant, intuitive, and pragmatic. The result was powerful, simple, and more powerful than most type systems available anywhere in the industry. TypeScript became a beloved industry standard very quickly, adopted almost universally and with great results. Developers with a theoretical background could build awesome tools and libraries that pragmatic web developers could use intuitively and without having to get a PhD in Computer Science (yes, Haskell, we are looking at you!).

### Development sample setup
TypeScript (from now on _TS_) is a compiled language.

> No, transpiled is not a word. When you take a high level language and translate it automatically into a lower level language, it's a _compiler_. Let's collectively deal with this and move on.

The process of compilation will start by type checking the program in order to make sure that there are no violations to the type system rules that might cause errors ultimately leading to a wrong datatype being used in a place where this does not make sense (like `"a string is not a number"/42`). After type-checking, if no errors have occurred, the original type annotations of TS, as well as any advanced features of the language, will be either stripped away ("elided") or simplified into plain JavaScript. The resulting JavaScript will have the guaranteed property that it is well behaved, meaning that it will not attempt to violate the rules of reasonable types.

In order to run TS, we need a few things that are very commonplane. A reasonably recent version of nodejs, and `yarn` (or `npm` if you don't care about wasting the precious and irreplaceable time of your limited existence, of course):

- create a new project with `yarn --init`
- add TS with `yarn add typescript -D` (`-D` because we want to include the TS compiler as a development utility but do not want any traces of it in the resulting compiled JavaScript
- add the TS config files with `yarn tsc -init`
- start compilation in watch mode with `yarn tsc -w`

Create a file `main.ts` in the same folder, and watch how the tsc compiler produces a corresponding JS file. That JS file can be run with `node main.js`. Add 

```tsc
console.log("Hello!")
```

and watch the magic unfold.

### Variables, primitive types, and expressions
The most basic construct of virtually any programming language is the _binding_ of values to names. This is mostly achieved through variables, constants, and function parameters. TypeScript offers three different keywords for binding: `let`, `const`, and the legacy `var`. We will not discuss `var` in depth as we consider it deprecated and do not use it: variables declared with `var` behave in a non-standard way with respect to scope, and as such we will use the better behaved `let` keyword. `let` and `const` declare a new symbol and bind it to a value right away:

```ts
let x = 10
const y = "hello world"
```

The names introduced by `let` and `const` are only available within the block (delimited by `{` and `}`) in which they are declared. This is called _scope_ and is considered the standard behaviour in modern programming languages:

```ts
let x = 100
console.log(x)
{
  let x = "hello world!"
  console.log(x)
}
console.log(x)
```

will print

```sh
100
hello world!
100
```

because after the closing `}` `x` refers back to the first declaration!

> Some constructs, such as lambda expressions, do not require `{` and `}` to define a scoping block, but the rules of scoping will apply anyway exactly as if curly brackets had been used.

While `let` introduces a variable, which can be further reassigned, `const` introduces a constant which cannot be changed later on in the program.


#### Primitive types and their expressions
TypeScript supports the usual basic arithmetic expressions on numbers, including the standard `Math.*` library of functions. For example:

```ts
let i = 2
let j = 3
console.log(i + j)
console.log(i * j)
console.log(i / j)
console.log(i % j)
console.log(i ** j)
console.log(Math.log2(i ** j))
```

Be careful: in TypeScript all numbers are `double` precision floating points (64 bits). While this might be sufficient in most scenarios, be aware that it is also possible to use the big guns (ehm, `big int`s to be precise), and sacrifice some runtime performance for high precision. We switch to `bigint` by using the `n` suffix after the last digit:

```ts
let i = 2n
let j = 3n
console.log(i + j)
console.log(i * j)
console.log(i / j)
console.log(i % j)
console.log(i ** j)
```

Booleans are also implemented the usual way, minus the `xor` operator which admittedly almost nobody ever uses:

```ts
let i = true
let j = false
console.log(i && j)
console.log(i || j)
console.log(!i)
```

Strings feature the usual basic operators (`+` for concatenation,  `length` for, well, getting the length of the string), plus a long list of available methods that perform all sorts of string processing:

```ts
let i = "hello"
let j = "world"
console.log(i + j)
console.log(`${i} ${j}`)
console.log(i.length)
console.log(`${i} ${j}${"!".repeat(5)}`)
console.log(`${i.replace("h", "H")} ${j}${"!".repeat(5)}`)
```


#### Basic type checking
TypeScript performs static type checking. We can verify this by attempting to compile the following code:

```ts
let i = "hello"
let j = 2
console.log(i / j)
```

This will result in the prompt of a type error:

```sh
error TS2362: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
```

Signaling that, while the code itself is sort of ok (dividing a variable by another variable), the fact that those variables are bound to types that do not support the division operator `/` causes an error. This sort of error is the result of a static analysis that runs through the code, makes use of all available information about which variable is bound to which type, and signals all incompatibilities. 

> One of the limitations of the type checker is that it will disallow code which could be ok in JavaScript, but is excluded from running within TypeScript. 
> The type checker therefore will exclude a lot of programs contain bugs, but at the same time it will also exclude a few valid programs that are caught in the crossfire.
> C'est la vie.

But how does TS know what type a variable have? Simple: unlike older languages like C or Java, where each variable must be painstakingly associated with a type manually, in TS the expression we assign to the variable when declaring is used in order to guess the type. This guessing process is called "type inference" (Computer Science people do like their big words, and "inference" sounds a lot better than "guessing").

In the following, TS has correctly inferred that `i` has type `string` and `j` has type `number`. As such they may be concatenated with the `+` operator which will convert `j` to a string:

```ts
let i = "hello"
let j = 2
console.log(i + j)
```

A variable may not change type. For this reason, the following code will not compile:

```ts
let i = "hello"
i = 100
```

with an error signaling that we are trying to put something of the wrong type for the variable:

```sh
error TS2322: Type 'number' is not assignable to type 'string'.
```

We may influence the process of type inference by providing type hints ("hints" sounds boring so the CS people went for "annotations", again sounding a lot smarter). Type annotations are given by using the semicolon:

```ts
let i:string = "hello"
let j:number = 2
console.log(i + j)
```

If we attempt something that does not make sense from a typing perspective, then we will get rewarded with a friendly error by means of which TS kindly requests that we improve the glaring errors in our miserable code. The following:

```ts
let i:string = "hello"
let j:string = 2
```

will produce an error:

```sh
error TS2322: Type 'number' is not assignable to type 'string'.
```

Simple primitive types such as `number` or `string` do not really require type annotations. Type annotations will be useful when using advanced types, which TS cannot infer on its own.

### Conditionals
Conditionals in TS follow the recognizable patterns of mainstream programming languages for the definition of conditional statements, but there are some unexpected twists in the relationship between types and conditionals that we will explore a bit later.

The conditional constructs of TS are three:
- ye olde _if statement_ `if-then-else`;
- ye olde _ternary operator_ `: ?`;
- ye olde _switch statement_ `switch-case`.

If statements require a boolean expression between brackets. If the boolean expression evaluates to `true`, we run the statement(s) in the first block of curly brackets, but if the expression evaluates to `false` then we run the statement in the second block of curly brackets (the second block is optional, if it's not there then nothing is executed when the expression is `false`):

```ts
if (x) {
  console.log("x is true")
} else {
  console.log("x is false")
}
```

We can nest if statements along multiple patterns, depending on our scenarios:

```ts
if (x) {
  if (y) {
    // x = true, y = true
  } else {
    // x = true, y = false
  }
} else if (z) {
  // x = false, z = true
} else {
  // x = false, z = false
}
```

The if statement is a statement, meaning that it is one of the building blocks we can add to the flow of our program. We use it in order to implement scenarios like _"if this do thing A, otherwise do thing B"_.

> Here _doing_ refers to the execution of other statements that ultimately result in changes to variables or the state of the application.

Sometimes we want to embed a smaller decision at the _expression_ level. 

> Expressions, unlike statements, do not affect the state of the program. Examples of expressions are: `x + 3`, `"a" + "b"`, `x + y > z * w`. Examples of statements are: `a = a + 1`, `console.log("Hello world!")`.
> This means that expressions do not end up assigning variables or in general performing operations that are not immutable (other terms for this are _pure_, _idempotent_, _stateless_, or _referentially transparent_). In general, working within the constraints of purity has some big advantages. Namely, pure code is easier to prove correct, to reason about, to debug, to optimize, and even to run in parallel.

Decisions at the expression level are also expressions that return a boolean value (`true` or `false`). These decisions can be taken by means of the ternary operator `?:`, which allows us to evaluate either one expression or the other based on the value of a boolean expression (the condition). It is very similar to an inline `if-then-else`:

```ts
x && y ? "Hello!" : "Goodbye!"
```

We can easily use such conditional expressions, for example as an argument to a function, thereby saving a few lines of code (and the associated reading effort) that would have otherwise been required by the corresponding `if-then-else`:

```ts
console.log(x && y ? "Hello!" : "Goodbye!")
```

An excerpt from an actual React snippet shows a chain of such conditional expressions in action:

```ts
currentState.kind == 'subscription-failure' ||
currentState.kind == 'subscription-cancel' ||
currentState.kind == 'change-payment-method-failure' ||
currentState.kind == 'change-payment-method-cancel' ||
currentState.kind == 'pay-open-payment-failure' ||
currentState.kind == 'pay-open-payment-cancel'
? fromJSX((setState) => (
  <SubscriptionLayout.FailureOrCancel
    backToSubscriptions={() => {
      window.history.pushState('', '', (routeUpdaters as any).subscription.url)
      setState(subscriptionUpdaters.overview)
    }}
  />
))
: currentState.kind == 'new subscription flow'
? newSubscriptionWidget(currentState)
: currentState.kind == 'stop subscription flow'
? stopSubscriptionWidget(currentState)
: currentState.kind == 'edit subscription flow'
? editSubscriptionWidget(currentState)
: currentState.kind == 'resume subscription flow'
? resumeSubscriptionWidget(currentState)
: currentState.kind == 'change payment method flow'
? changePaymentMethodWidget(currentState)
: currentState.kind == 'pay open payment flow'
? payOpenPaymentWidget(currentState)
: nothing()
```

Conditional expressions play a particularly important role in the definition of lambda functions, which we will see soon.

### Loops
TypeScript supports old-school loops. These loops allow the repetition of a block of code containing one or more statements until a given condition is met.

The simplest such construct is known as the `while` loop, which:
- evaluates a given condition
- if the condition is `true`, it runs the body and starts all over again
- if the condition is `false`, it moves on to the next instruction after the loop

For example:

```ts
let counter = 0

console.log(`Starting to count.`)

while(counter < 10) {
  counter = counter + 1
  console.log(`The counter is now at ${counter}...`)
}

console.log(`Done counting.`)
```

Will produce the following result:

```sh
Starting to count.
The counter is now at 1...
The counter is now at 2...
The counter is now at 3...
The counter is now at 4...
The counter is now at 5...
The counter is now at 6...
The counter is now at 7...
The counter is now at 8...
The counter is now at 9...
The counter is now at 10...
Done counting.
```

We may nest loops of course, for example:

```ts
let s = ""
let y = 0
while (y < 5) {
  
  let x = 0
  while (x < 5) {
    s = `${s}${x > y ? "*" : " "}`
    x++
  }
  s = `${s}\n`
  y++
}

console.log(s)
```

Will produce:

```sh
 ****
  ***
   **
    *
```

When we are certain that we want to run the body at least once, we can use the `do-while` loop:

```ts
let s = ""
let y = 0
do {  
  let x = 0
  do {
    s = `${s}${x > y ? "*" : " "}`
    x++
  } while (x < 5)
  s = `${s}\n`
  y++
} while (y < 5)

console.log(s)
```

> Notice that `while` will, if the condition is `false` right away, skip the body altogether. `do-while` will always, no matter what, run the body at least once the first time before even looking at the condition. Be advised!

`while` loops suffer from a slight issue. It is possible to accidentally write a loop which never terminates, thereby temporarily turning your PC into a very expensive book holder in the best case, or very quickly spending gazillions on cloud hosting that goes directly to our good friends at Azure or AWS (who, let's be honest, don't really need our help that much...). The existence of Hellish constructs such as `break` or `continue` (yes, go for it, Google them!) makes things surrounding `while` loops potentially even more complex and unpredictable, and complexity and unpredictability in code always end up meaning one and one thing only: bugs.

In order to limit the destructive potential of very open `while` loops, our Computer Science ~~overlords~~ predecessors noticed that most loops have to do with iterating for a specific number of steps. For example, over each element of an array, or each character of a string, or each...whatever in a whatever. This led to the discovery of the `for` family of loops.

The various kinds of `for` loops are focused on iterating over a fixed number of steps. The number of steps is either determined explicitly (for example `10`, `20`, or `n`), or implicitly (for example the number of elements of an array or another iterable).

The iteration based on a fixed number of steps is considered the basic `for` loop. We have an initialization statement, which will usually introduce a new iteration variable, a condition which (very much like in a `while` loop) decides whether or not the next iteration will be performed, and finally an incremental step that keeps the counter moving. For example:

```ts
for (let i = 0; i < 10; i++) {
  console.log(`Running iteration ${i}`)
}
```

In general, a `for` loop is built according to the following "template":

```ts
for (INIT; COND; INCR) {
  BODY
}
```

Such a template can always be translated into an equivalent `while` loop:

```ts
INIT
while (COND) {
  BODY
  INCR
}
```

The big advantage of a `for` loop over a `while` loop is that the definition of how many and which steps will be taken is all neatly grouped in the first line of code, which ends up being packed with useful information. This makes `for` loops easier to read and more immediate to understand, because they follow a fixed pattern of iteration and represent it neatly in visual format.

When dealing with collections such as arrays (which we will discuss in depth later), we could iterate all the elements of the loop as follows:

```ts
let people = [{ name:"John", surname:"Doe" }, { name:"Jane", surname:"Doe" }, { name:"Alice", surname:"Doe" }, { name:"Bob", surname:"Doe" }, { name:"Trudy", surname:"Doe" }]
for (let i = 0; i < people.length; i++) {
  let person = people[i]
  console.log(`${person.name} says "Hello!"`)
}
```

The whole management of the `i` and `person` variables is very predictable and always the same for this kind of loop. Given that this kind of loop happens all the time, it has been streamlined by allowing us to skip defining and managing the `i` variable altogether. This streamlined version of this loop is the `for-of` loop:

```ts
let people = [{ name:"John", surname:"Doe" }, { name:"Jane", surname:"Doe" }, { name:"Alice", surname:"Doe" }, { name:"Bob", surname:"Doe" }, { name:"Trudy", surname:"Doe" }]
for (let person of people) {
  console.log(`${person.name} says "Hello!"`)
}
```

Much cleaner!

> Be careful not to confuse `for-of`, which iterates the _values_ of a collection, and `for-in`, which iterates the keys of the collection.

> In practice, most advanced practitioners will rarely use loops, and more often use higher order functions that manipulate collections such as `map`, `filter`, or `reduce`. Looping statements such as `while` are very open in nature. They offer us the freedom to write loops in any way we might want. While this sort of freedom might sound appealing, consider that most loops are usually very structured: "do something to each element of an array or list" is probably the most common by far and large, and other commonly recurring patterns are also easy to find. The big advantage to using constructs such as `map`, `filter`, etc. is that they restrict our freedom to write any sort of loop we want, but in doing so also greatly reduce the margin for error.
> A lot of advanced programming and design patterns have to do with reducing the margin for error anyway, so anything that helps is usually welcome.

### Functions and lambdas
TypeScript obviously has functions. There are multiple ways of defining functions. The most extensive is derived from earlier releases of JavaScript, and somewhat implies that a function is a big thing with potentially many parameters and many lines of code in the body:

```ts
function quadratic(x:number, a:number, b:number, c:number) : number {
  const firstTerm = x * a * a
  const secondTerm = x * b
  const thirdTerm = c
  return firstTerm + secondTerm + thirdTerm
}
```

Note that the declaration contains the parameters with their types as well as the return type:

$$
\begin{align}
\texttt{function }\underbrace{\texttt{quadratic}}_{\text{name of the function}}(
  \underbrace{\texttt{x:number, a:number, b:number, c:number}}_{\text{name and type of the parameters}}) : \underbrace{\texttt{number}}_{\text{return type}}
\end{align}
$$

We can invoke a function by providing arguments for all parameters:

```ts
console.log(quadratic(1, 2, 3, 4))
```

#### Anonymous functions/lambda expressions
Sometimes the body of the function is so short that one single expression that is returned immediately is sufficient. In that case, we can shorten the definition into a lambda expression as follows:

```ts
const quadratic = (x:number, a:number, b:number, c:number) : number => x * a * a + x * b + c
```

We can invoke a function defined like this exactly like we did before:

```ts
console.log(quadratic(1, 2, 3, 4))
```

When functions are defined as expressions without a name, they are called "lambda expressions". Such a lambda expression is an expression just like any other expression. This means that it can be assigned to a variable, passed as an argument to another function, and so on. For example, we could define a function that takes another function as a parameter:

```ts
const repeat = (step:(_:number) => string, numberOfSteps:number) : string => {
  let accumulator = ""
  for (let index = 0; index < numberOfSteps; index++) {
    accumulator = accumulator + step(index)    
  }
  return accumulator
}
```

We could invoke it as follows:

```ts
console.log(repeat(i => "*".repeat(i+1) + "\n", 5))
```

Obtaining:

```sh
*
**
***
****
*****
```

If we are feeling bold we might even shorten the original definition by using recursion and conditional expressions in the very elegant, but slightly more complex:

```ts
const repeat = (step:(_:number) => string, numberOfSteps:number) : string => 
  numberOfSteps <= 0 ? ""
  : repeat(step, numberOfSteps-1) + step(numberOfSteps-1)
```

Notice that `step` is a parameter of type "function from `number` to `string`". This makes of `repeat` a so-called _higher order function_, hinting at the fact that a function that gets a function as a parameter does not manipulate low-order values (like primitive types or arrays or other concrete data structures) but rather computations (that is functions), and as such is of a higher order.

#### Scope
TypeScript uses nested _scopes_. The scope represents the reach of a name, such as a function parameter, a temporary variable, etc. Code blocks delimited by curly brackets (the body of a conditional, a loop, or a function) creates a new scope. Variables defined in a given scope are accessible in that scope and also in child scopes, but not in parents scopes:

```ts
{
  let x = 1
  {
    console.log(x) // <- this is ok because x is in the parent scope; it prints 1
    let y = 2
    console.log(y) // <- this is ok because y is in its scope of definition; it prints 2
    {
      let x = "hello world" // <- this redefines x from this scope onwards
      console.log(x) // <- this is ok and prints "hello world"
    }
  }
  console.log(x) // <- this is ok and prints 1
  console.log(y) // <- this gives a compiler error because y does not exist in this scope
}
```

Understanding scopes as well as the redefinition of symbols (like the nested `let x` statement in the sample above) is core to knowing which variables, function parameters, etc. are active at any given point in our code.

### Custom types and interfaces
The main power of TypeScript when compared to JavaScript lies, just like the name of the language suggests, in its ability to define types. Types represent the coarse shape of all elements of the language. For example, if one were to say that `x` is a variable then there would not be a lot of information available about what `x` does in our program. We use types in order to _narrow_ down the information about the variables and constants ("symbols") in our program. We could also say `x : number`, and in doing so we have gotten a lot more precise about what _may be_ contained in `x` (`0, 1, 2, 3, -1, -2, -3, ...`) and what _may not be contained_ (strings, arrays, booleans, functions, and a whole host of other things).

> In a sense stating the type of a symbol is as much about saying what the symbol will potentially be as saying what the symbol cannot be.
> If you think about how many things we can represent in TypeScript: arrays, functions, objects, and a host more, it is likely that any given type will exclude infinitely more patterns than it will allow. Let your mind's eye gaze upon this wonderful landscape of possible computational shapes and marvel at its immense depth and complexity.

Some types are simple, as in they directly represent primitives that cannot be decomposed into smaller entities:

```ts
let x:number = 1
let s:string = "hello"
let c:boolean = true
```

More interesting types appear when we define composite entities. Composite entities derive from the composition (or "mixing", or "using together") of other types. One such composition construct we have seen already is the function. Functions combine input parameters into an output that gets returned. This is also reflected at the type level. The type of a function is based on the idea of an arrow which starts at the inputs and goes at the outputs, and the arrow is literally represented in ASCII as follows:

`inputs => output`

We could define a function such as:

```ts
function add(x:number, y:number) : number {
  return x + y
}
```

by separating the type definition (which already constrains the function to a certain set of parameters and a given return type) from its body as follows:

```ts
const add : (_1:number, _2:number) => number = 
  (x,y) => x + y
```

One of the beautiful advantages of this second notation is that the first line of code states the name of the function and its general shape at the type level. This acts as a form of documentation that might be enough for most people using this code without having to modify it. The second line of code jumps into the nitty-gritty implementation details. Stating types clearly is thus also a way to document our code in a way that the compiler will check for us, so it is the most reliable and accurate form of documentation that we have available.

Another very common composite type is the type of objects or records. Objects are a way of grouping together a set of names, each associated with its own type and its own value. This can make a lot of sense when we want to give a name to a series of things that are meant to go together, such as all the information about a person or an address:

```ts
let person = {
  name:"John", surname:"Doe"
}

let address = {
  city:"Amsterdam",
  street:"George Gershwinlaan",
  number:27,
  postcode:"1082MT"
}
```

Objects, just like anything else in the language, have a type. This type defines the names allowed inside the object, as well as the types of the values that can be bound to each name. Just like we would do in real-life, let's define the type of both `Person` and `Address` explicity:

```ts
type Person = { name:string, surname:string }
type Address = { city:string, street:string, number:number, postcode:string }

let person:Person = {
  name:"John", surname:"Doe"
}

let address:Address = {
  city:"Amsterdam",
  street:"George Gershwinlaan",
  number:27,
  postcode:"1082MT"
}
```

Thanks to these declarations, it is now possible for the compiler to detect and signal errors of all sorts: missing fields, typos, wrong types, etc. For example, if we were to make a mistake like:

```ts
let person:Person = {
  name:"John", 
  surname:"Doe",
  age:27
}
```

then TypeScript would tell us that:

```sh
main.ts:7:3 - error TS2322: Type '{ name: string; surname: string; age: number; }' is not assignable to type 'Person'.
  Object literal may only specify known properties, and 'age' does not exist in type 'Person'.

7   age:27
```

which is clearly stating that trying to add an `age` property is not compatible with the definition of `Person`.

Errors such as a mismatch between the type of a field and the type of the assigned value, will also be signaled:

```ts
type Person = { name:string, surname:string, age:string }
let person:Person = {
  name:"John", 
  surname:"Doe",
  age:27
}
```

by pointing out the place where the error occurred as well as why it is an error in reference to the place where the mismatching type was defined:

```sh
main.ts:5:3 - error TS2322: Type 'number' is not assignable to type 'string'.

5   age:27
    ~~~

  main.ts:1:46
    1 type Person = { name:string, surname:string, age:string }
                                                   ~~~
    The expected type comes from property 'age' which is declared here on type 'Person'
```

#### Nominal vs structural types
TypeScript, unlike languages such as C#, is a structural language. This means that the name given to types is not the most relevant thing, as long as the structures of the things being assigned one to the other are compatible.

For example, consider the scenario where we have two types, and one of the two is a direct superset of the other (that is one of the two types has all the same fields of the other with exactly the same types). Then we may perform assignment as follows:

```ts
type Person = { name:string, surname:string }
let person:Person = {
  name:"John", 
  surname:"Doe"
}

type WithName = { name:string }
let john:WithName = person
```

which is allowed because assigning `person` to `john` ensures that all the fields that are needed in order to correctly provide a value for `john` (just a `name:string`) are available in `person`.

Consider the more schematic example that follows:

```ts
type A = { a:string }
type B = { b:number }
type C = { a:string, b:number, c:boolean }

let a:A = { a:"a" }
let b:B = { b:1 }
let c:C = { a:"a", b:1, c:true }
```

we could then assign a value of type `C` to any symbol of type `A` or `B`, because everything that is needed by either `A` or `B` is already available in any value of type `C`. 

#### Unions, intersections, and flow
The opposite though, that is assigning a value of type `A` or `B` to a symbol of type `C` cannot be done out of the box without a little trick. Let's see how this is done!

First of all, let's introduce the spread operator. The spread operator allows to make a (shallow) copy of all the fields of a record in a very compact syntax. We could for example write:

```ts
let john = { name:"John", surname:"Doe", age:35 }
let jane = {...john, name:"Jane" }
console.log(jane)
```

and this would assign all the fields of `john` to `jane` (that's the result of `...john`), and override only the `name` field to `"Jane"`, resulting in:

```sh
{ name: 'Jane', surname: 'Doe', age: 35 }
```

> Using the spread operator is very handy when there are many fields we want to just keep as they were, while only modifying a small subset or even adding new fields. One single short expression, `...x`, results in the assignment of a lot of fields in one go. Handy!

We could go back to our example with the `A`, `B`, and `C` types, and use the spread operator to create an instance of `C` from two instances of, respectively, `A` and `B`, plus the extra missing boolean field as follows:

```ts
type A = { a:string }
type B = { b:number }
type C = { a:string, b:number, c:boolean }

let a:A = { a:"a" }
let b:B = { b:1 }
let c:C = { ...a, ...b, c:true }
```

This is sort of stating that `C` is the same as `A` and `B` "together", plus an extra field `c:boolean`. TypeScript can actually capture this very explicit at the type level, something very few modern programming languages can actually achieve nowadays!

TypeScript allows us to combine types together through a series of type-level operators.

> Just like we can combine numbers with arithmetic operators such as `+`, which will take two numbers and just squish them into one single number, there are operators that squish types together into new types. This power is huge, because it enables us to perform computations at the type level, thereby generating even very complex types from relatively simple declarative inputs. The possibilities for enhancing program correctness are just slowly entering the collective mindset, but imagine everywhere we use unsafe strings (ehm, routes!) could become type safe and impossible to get wrong in a few short years. Truly an exciting time be in software development!!!

The simplest operator between types is `&`, which simply combines two types together by taking all the fields of one type and all the fields of another type: 

```ts
type A = { a:string }
type B = { b:number }
type C = A & B & { c:boolean }
```

In this small example we are not making a lot of difference, but the moment types such as `A` and `B` are either used in many places (like interfaces if you will), or they end up containing a lot of fields, then we will end up saving a lot of typing and possible mistakes.

One could even consider assembling types from basis recurrent elements, such as:

```ts
type HasId = { id:string }
type HasName = { name:string }
type HasAge = { age:number }

type Person = HasId & HasName & { surname:string} & HasAge
type Company = HasId & HasName & HasAge & { numberOfEmployees:number }
```

This is quite exciting, because it allows us to define fragments of our type-level domain and then just combine them freely!

The `&` operator, also known as a "product type", corresponds roughly to multiplication in the domain of numbers. It is a form of multiplication because the number of valid values of the result of a product type is the product of the number of valid values of the operands. Consider for example the type `{ x:boolean } & { y:boolean }`. It has a possible total of four values, two for `x` and two for `y`, but `{ x:boolean }` only supports two values just like `{ y:boolean }`. Hence, product! Of course sometimes the number of values is infinite, so consider product here in the broader sense as also including infinites.

Just like regular algebraic operations on numbers, we can also add types together. Adding types means that we want to have all the values of one or the other type, but not both at the same time. This is achieved with the sum type, or `|` type-level operator. Let's say that we want to model some polymorphic entity such as an employee being either a developer or a devops specialist, but not both at the same time (don't ask too many questions about this domain, let's keep it simple please!). We could do so as follows:

```ts
type Developer = { name:string, surname:string, language:string }
type DevOpser = { name:string, surname:string, distro:string }
type Engineer = Developer | DevOpser
```

Now we can assign to a variable of type `Engineer` either the fields of `Developer` or `DevOpser`, like this:

```ts
let engineer1:Engineer = { name:"John", surname:"Doe", language:"C#" }
let engineer2:Engineer = { name:"John", surname:"Doe", distro:"Arch" }
```

One might even combine `&` and `|` together into a single type definition beautifully as follows:

```ts
type Person = { name:string, surname:string }
type Developer = Person & { language:string }
type DevOpser = Person & { distro:string }
type Engineer = Developer | DevOpser
```

or, if we don't care to define all of those potentially polluting intermediate types, in one very cool go:

```ts
type Engineer = { name:string, surname:string } & ({ language:string } | { distro:string })
```

> Notice the use of parentheses: just like in regular arithmetics, `&` takes precedence over `|` so we have to take care of specifying that we want the `&` to be applied to the result of the sum.

When dealing with unions, we need a way to find out with type-level certainty which alternative we are dealing with. For example, if we wanted to print an instance of `Engineer`, we would first need to determine whether or not we are dealing with a developer or a devops'er, and then print the right fields accordingly. We may not just write something like:

```ts
function printEngineerWrong(engineer: Engineer) {
  console.log(`${engineer.name} ${engineer.surname} programs in ${engineer.language}`)
}
```

because we would (rightly) get the error that `language` does not exist on type `Engineer` (actually it sort of does, but it is hidden beneath an `|` operator and so it does not exist _always_, which is kind of the same because the compiler wants to be 100% certain that our code will not blow up, which is actually kind of nice if you think about it).

One of the best ways in order to achieve this is simply to check whether or not one of the exclusive fields (like `language`) is there. The elegant and intuitive `is` operator is exactly there for us to achieve this:

```ts
function printEngineer(engineer: Engineer) {
  if ("language" in engineer) {
    console.log(`${engineer.name} ${engineer.surname} programs in ${engineer.language}`)
  } else {
    console.log(`${engineer.name} ${engineer.surname} uses ${engineer.distro}`)
  }
}
```

Notice that we don't need to check whether or not `"distro" in engineer` in the `else` branch: if `"language" in engineer` was `false`, then it is necessary that `distro` will be there because there are only two options. If you were to check (by hovering with the mouse inside VS Code) what the type of `engineer` is in either of the two branches, you will notice that according to TypeScript the type of `engineer` is changing depending on where we are in the program!!! Inside the branches of the `if` we have more information about the actual type of `engineer`, and this information is processed by the type system in a process called data-flow type system. This is insanely cool and so logical if you think about it that it's an actual wonder why this has not been adopted sort of everywhere in all modern programming languages, but hey, people are still using Python so you never really know what's going on.

Unions as we have just seen them might have some trouble caused by side effects. Consider for example the following union (maybe some data coming from an API where we have little control over):

```ts
type ApiResponse = { name:string, surname:string, created:string } | { name:string, surname:string, created:Date }
```

> Which we could also refactor by grouping out the common factor as: `type ApiResponse = { name:string, surname:string } & ({ created:string } | { created:Date })`, but for now let's focus on the overlad of union fields.

The fields of the `ApiResponse` union are fully overlapping, meaning that the `in` operator as we have seen before will not be enough to discriminate precisely. We could combine it with the `typeof` oeprator, but this will not work well in some cases with nesting (which, yes, happen in real life). We need a proper solution that scales well, and this solution is surprisingly simple. We will go from simple unions to _discriminated unions_, which just add one field with a constant type that allows us to fully discriminate. The example above could then be restructured as follows:

```ts
type ApiResponse = { kind:"response 1", name:string, surname:string, created:string } | { kind:"response 2", name:string, surname:string, created:Date }
```

Thanks to the `kind` field, which is not of type `string` but rather `"response 1" | "response 2"`, we can perform a 100% reliable test of whether or not an instance of `ApiResponse` is of the first or second kind. We do this by just checking the value of `kind` with any conditional operator (`if` being the most common, but `?:` works as well):

```ts
function printApiResponse(apiResponse:ApiResponse) {
  if (apiResponse.kind == "response 1") {
    console.log(`The created date is a string`)
  } else {
    console.log(`The created date is a Date`)
  }
}
```

Note that inside each branch of the `if`, the type of `apiResponse` actually changes. It gets _narrowed down_ to, respectively, `{ kind:"response 1", name:string, surname:string, created:string }` inside the `then` branch and to `{ kind:"response 2", name:string, surname:string, created:Date }` inside the `else` branch. Before the whole `if-then-else` and right after, the type goes back to `ApiResponse` of course, because only inside the branches of the conditional can we say something meaningful about the precise type.

The flow type system works with nesting and all sorts of composition, meaning that there is no limit to how deep the rabbit hole goes:

```ts
type LinkedList = { kind:"empty" } | { kind:"element", element:string, rest:LinkedList }

const getThirdElement = (list:LinkedList) : string | undefined => 
  list.kind == "element" && list.rest.kind == "element" && list.rest.rest.kind == "element" ? list.rest.rest.element : undefined
```

The order in which the conditions are evaluated is very important: `list.rest.kind` will not give a compiler error only because we are on the right side of an `&&` conditional which left side has already checked that `list.kind == "element"`. 

> All sorts of complex conditions applying De Morgan rules will still work the same, for example instead of writing `list.kind == "element" && list.rest.kind == "element"` we could have written `list.kind != "empty" && list.rest.kind == "element"` with exactly the same result. In this case it's not a big improvement but it can make a difference, and in general having a smarter assistant (the programming language type checker) that never makes mistakes, never sleeps, and never gets distracted is better than having a dumber assistant.

##### Combining `&` and `|`
Let's close this section with a little pearl. Remember we said that `&` acts like multiplication while `|` (in the case of discriminated unions to be precise) acts like addition? This means that we can use `&` in order to generate many combinations of valid types with little code. Let's say we have a series of valid flag combinations:

```ts
type T = 
  | { x:"A", y:"C" }
  | { x:"A", y:"D" }
  | { x:"B", y:"C" }
  | { x:"C", y:"D" }
```

We could have _generated_ this set of all combinations more easily as follows:

```ts
type T = { x:"A"|"B" } & { y:"C"|"D" }
```

Cool eh?


### Generics
Sometimes a series of types in practice end up looking almost exactly like one another. Repetition of code is, in general, considered a dangerous property because it increases the effort to maintain a code base (changes to a copy of code do not automatically propagate to the other copies), and for the same reason it increases the risk of defects and bugs.

The tools for reducing repetition in code are centered around _functions_. Functions group together the parts of code that do not change (the body of the function) and leave out the parts that do change (the parameters of the function) to be specified later for each instance. This method of grouping and parameterizing similar instances falls under the broad scope of _abstraction_. And the good news is that we can do exactly the same, just for types. Functions at the type level are based on _generics_. Generic types are type-level function that take as input one or more other types and return a new type resulting from some pattern.

Enough chit-chat, let's dive into a concrete example. Consider the following two types defining a linked list:

```ts
type NumberList = { kind:"empty" } | { kind:"element", element:number, rest:NumberList }
type StringList = { kind:"empty" } | { kind:"element", element:string, rest:StringList }
```

These two types would be easy to "return" starting from the type of the `element`, and "lo and behold!", we can do this by adding a type parameter to a `List` type and generate all types such as the two lists we have just seen, as well as infinitely many others:

```ts
type List<Element> = { kind:"empty" } | { kind:"element", element:Element, rest:List<Element> }
type NumberList = List<number>
type StringList = List<string>
type BoolList = List<boolean>
type PersonList = List<{ name:string, surname:string }>
```

After having defined a generic type such as `List` we can also define the accompanying utility and manipulation functions. Those functions will also need to be generic, because only by being generic will they be able to deal with all of the possible infinite instances of the generic type they work with. Let's start with a simple traversal function that prints all elements of a generic list:

```ts
function printAll<Element>(list:List<Element>) {
  if (list.kind == "empty") return
  console.log(list.element)
  printAll(list.rest)
}
```

There are alternative syntaxes to this which can be useful when dealing, for example, with generic lambda expressions. The function above can be rewritten as:

```ts
const printAll = <Element>(list:List<Element>) => {
  if (list.kind == "empty") return
  console.log(list.element)
  printAll(list.rest)
}
```

Notice the slight difference in how the generic parameter `Element` is positioned. Nothing major but still, be aware of this possibility. Also, there is a third option that emphasizes the type structure and splits it from the definition of the function. Might come in handy when the type says more than the definition:

```ts
const printAll 
  : <Element>(_:List<Element>) => void 
  = list => {
  if (list.kind == "empty") return
  console.log(list.element)
  printAll(list.rest)
}
```

The last option is, personally, a favorite of mine because it neatly splits the domain of types and structures, which is a very important form of machine-verified documentation, from the domain of detailed code implementation. It sort of forces us to operate at two levels at the same time: specification vs implementation, which is actually quite useful on larger scale codebases.

We can print all elements of the list, but what if we wanted to be able to achieve more than just printing? We can define a generic `forEach` function that also does not specify what happens to each element thanks to a lambda parameter. This allows us to achieve ultimate flexibility and reusability!

> This pattern may seem complex at first, but its power is so unquestionable that this way of organizing code has found its way in virtually all modern programming languages, starting from C# and ending up in Python, Java, C++, and so much more. Bear with me and be assured: this complexity has a huge payoff in organizing code elegantly and powerfully, while also reducing the risk of bugs and mistakes. All in exchange for a little bit of effort that will allow your mind and imagination to stretch their wings. What's not to love?

```ts
const forEach 
  : <Element>(_:(_:Element) => void, __:List<Element>) => void 
  = (processItem, list) => {
  if (list.kind == "empty") return
  processItem(list.element)
  forEach(processItem, list.rest)
}
```

Ok, let's unpack this. First, the type declaration:

$$
\underbrace{\texttt{<Element>}}_{\text{the type of each element of the list}}(
  \underbrace{\texttt{\_:(\_:Element) => void, }}_{\text{the function that will process each element of the list}}
  \underbrace{\texttt{\_\_:List<Element>}}_{\text{the list itself}}
)\underbrace{\texttt{ => void }}_{\text{the return type}}
$$

The only thing that looks a bit ugly here is, in my very subjective opinion, the type of the function that processes each item: `(_:Element) => void`. We can just dispense of this ugliness by defining a generic type for functions and then using it:

```ts
type Fun<a,b> = (_:a) => b

const forEach 
  : <Element>(_:Fun<Element, void>, __:List<Element>) => void 
  = (processItem, list) => {
  if (list.kind == "empty") return
  processItem(list.element)
  forEach(processItem, list.rest)
}
```

We could now rewrite the original `printAll` function as follows:

```ts
const printAll 
  : <Element>(__:List<Element>) => void 
  = list => forEach(console.log, list)
```

Gorgeous, isn't it? But wait! We can cross over into the realm of idealistic mathematical elegance. Bear with me for another minute! We can redefine `forEach` so that it takes the parameters in order, one after the other, instead of all in one go. We can do so as follows:

```ts
const forEach 
  : <Element>(_:Fun<Element, void>) => (_:List<Element>) => void 
  = processItem => list => {
  if (list.kind == "empty") return
  processItem(list.element)
  forEach(processItem)(list.rest)
}
```

This mechanism is known as _currying_ and allows us to invoke a function with a prefix of its parameters instead of all in one go. Useful when some parameters are specified earlier, or more often, than others. Then we define `printAll` even more trivially as follows:

```ts
onst printAll 
  : <Element>(__:List<Element>) => void 
  = forEach(console.log)
```

And now we did not even have to repeat the pointless `list` parameter that we just proxy through to `forEach`, but the only thing we needed to specify (`console.log`) is meaningful and important!

There are many more useful generic functions that we usually want to have available on generic collections such as our linked list. These functions are so important that they are virtually present in all modern languages and their standard libraries, just out of the box. Let's get to see them in action!

A very common goal when iterating a collection is to transform all of its elements in one way or another. This usually results in a new collection with the same number of elements, just all transformed in one way or the other. This sort of transformation is usually called `map`. Let's discover the `map` function by first exploring two of its concrete instances: the functions which increment or decrement all values of a list of numbers by one:

```ts
const increment
  : (_:List<number>) => List<number>
  = list => {
  if (list.kind == "empty") return { kind:"empty" }
  else return { kind:"element", element:list.element+1, rest:increment(list.rest) }
}

const decrement
  : (_:List<number>) => List<number>
  = list => {
  if (list.kind == "empty") return { kind:"empty" }
  else return { kind:"element", element:list.element-1, rest:decrement(list.rest) }
}
```

> In general it's a good idea to build abstract patterns and generic functions bottom up, by generalizing multiple concrete examples. This way we prevent abstracting in the wrong direction, which ends up doing more bad than good by introducing complexity and parameters that are not required in practice.

By putting these two functions side by side, we can see immediately that they are almost the same, minus the operation we perform on each element. We could therefore generalize this operation by means of an extra parameter (a lambda expression) as follows:

```ts
const transform
  : (_:Fun<number, number>, __:List<number>) => List<number>
  = (operation, list) => {
  if (list.kind == "empty") return { kind:"empty" }
  else return { kind:"element", element:operation(list.element), rest:transform(operation,list.rest) }
}
```

Ok, we are getting there. Let's introduce currying and see how to implement the original `increment` and `decrement` functions:

```ts
const transform
  : (_:Fun<number, number>) => (_:List<number>) => List<number>
  = operation => list => {
  if (list.kind == "empty") return { kind:"empty" }
  else return { kind:"element", element:operation(list.element), rest:transform(operation)(list.rest) }
}

const increment = transform(_ => _ + 1)
const decrement = transform(_ => _ - 1)
```

But what if we wanted to apply an element transformation that produces something other than a `number`? Then we need to make `transform` generic:

```ts
const transform
  : <transformedElement>(_:Fun<number, transformedElement>) => (_:List<number>) => List<transformedElement>
  = operation => list => {
  if (list.kind == "empty") return { kind:"empty" }
  else return { kind:"element", element:operation(list.element), rest:transform(operation)(list.rest) }
}
```

Now we could even generate, say, a list of strings from a list of numbers:

```ts
const toStrings : Fun<List<number>, List<string>> = transform(_ => _.toString())
```

But what if the input list had elements of varying types? Well, then we can also introduce a second type parameter for the elements of the input list:

```ts
const transform
  : <originalElement, transformedElement>(_:Fun<originalElement, transformedElement>) => (_:List<originalElement>) => List<transformedElement>
  = operation => list => {
  if (list.kind == "empty") return { kind:"empty" }
  else return { kind:"element", element:operation(list.element), rest:transform(operation)(list.rest) }
}
```

Notice that all parameters are now generic. The `operation` simply transforms an `originalElement` into a `transformedElement`, the input list is a `List<originalElement>`, and the resulting list is a `List<transformedElement>`. The fact that we now deal with two generic arguments adds a small snag though. The definitions:

```ts
const increment = transform(_ => _ + 1)
const decrement = transform(_ => _ - 1)
```

don't work anymore because TypeScript is not smart enough to guess that the type of `_` must be a number. We get a compiler error stating that:

```sh
error TS18046: '_' is of type 'unknown'.
```

When something like this happens, it means that the typechecker is unable to guess our intentions on its own. One extreme but always effective options is to specify the type parameters explicitly:

```ts
const increment = transform<number, number>(_ => _ + 1)
const decrement = transform<number, number>(_ => _ - 1)
```

Blah, ugh, sooooo ugly and verbose, but sometimes it's really needed. Not this time though: before specifying each type parameter though, we can try and see if adding some hints helps the type checker without having to go this far. For example, we could see if just stating that the input of the transformation operation is a number is sufficient, and indeed the compiler errors have now disappeared into the nothingness where all compiler errors are supposed to end up after we shine the light of our brilliance on them:

```ts
const increment = transform((_:number) => _ + 1)
const decrement = transform((_:number) => _ - 1)
```

There! Much cleaner, and we are still leveraging the type checker's ability to guess stuff for us, even if it is just the second generic parameter. Every time we can get help from the machine it is a good idea to do so, because the machine tends to be more precise than us and so leaning on it produces a wonderful combination of human creativity and machine reliability. The age of the cyborg is now, and when done right it's actually awesome.

#### Generic containers
Given that a lot of `for` loops are mostly meant for going through all the elements of a collection, TypeScript has a specialized syntax for doing this: the `for-of` loop. For example, we could loop through all the elements of an array as follows:

```ts
for (let x of [1,2,3,4,5]) console.log(x)
```

which quite predictably produces:

```sh
1
2
3
4
5
```

> Be careful not to confuse `for-of` and `for-in`. `for-in` iterates through the fields of an object, and is very rarely what we want unless doing some unusual structural processing or transformation of objects bsaed on the names of fields. You have been warned!

Let's have a little bit of fun. It is possible to define our own logic for iterating something via `for-of`. This requires having a special property on our object, the `[Symbol.iterator]` property. Let's also add the `map` method so that we start turning our `List` into something a little more complete and professional:

```ts
type List<Element> = 
  ({ kind:"empty" } | { kind:"element", element:Element, rest:List<Element> }) & {
    [Symbol.iterator](): IterableIterator<Element>,
    map: <transformedElement>(operation:Fun<Element, transformedElement>) => List<transformedElement>
  }
```

It's handy to not have to build this structure from scratch everytime, so let's define two constructors: one for the empty list, and one for lists with at least one element:

```ts
const empty = <Element>() : List<Element> => ({
  kind:"empty",
  *[Symbol.iterator](): IterableIterator<Element> {},
  map: function<transformedElement>(this:List<Element>, operation:Fun<Element, transformedElement>) : List<transformedElement> { return transform(operation)(this) }
})

const element = <Element>(element:Element, rest:List<Element>) : List<Element> => ({
  kind:"element", element, rest,
  *[Symbol.iterator](): IterableIterator<Element> {
    yield element
    for (let x of rest) yield x
  },
  map: function<transformedElement>(this:List<Element>, operation:Fun<Element, transformedElement>) : List<transformedElement> { return transform(operation)(this) }
})
```

Notice the implementation of `map` is very simple: we just invoke the `transform` function we already had, and we pass it the `operation` and `this`. More interesting is the use of generator functions, prefixed with `*` and used to produce a lazy sequence of elements. Each time we use the `yield` operator inside a generator we add an element to the resulting collection. For `empty` we just never call `yield` and that results in an empty collection, but for the other scenario we yield the `element` right away (because that is the first element of the collection) and then just yield all the elements of the remaining collection recursively.

The consequence of this is that we could, for example, write the following:

```ts
const range : Fun<[number,number], List<number>> = ([min, max]) => min > max ? empty() : element(min, range([min+1,max]))

for (let x of range([0,10])) console.log(x)
```

Or, even more exciting:

```ts
for (let x of range([0,10]).map(_ => _ * 2)) console.log(x)
```

which uses `map` directly in order to produce a new list of transformed elements with the flow style of syntax. Ahhh, the elegance and beauty of it!

#### The _almost_ standard library
Most programming languages have a standard library of collections. Thanks to the great efforts of the good people at Facebook, TypeScript also has a very good implementation of most modern data structures such as lists, stacks, and more. The library is called `immutablejs`, and it combines a few important principles of TypeScript programming:
- it uses generics in order to have as much type safety as possible
- it uses `map`, `filter`, and a host of other higher order functions
- it embraces the principle of immutability as a foundation, meaning that you can only change a collection by creating a new one with the included modifications

Let's begin by the simplest data structure: the linked list. Suppose we wanted to create a sample list with a series of elements. The simplest way to achieve this would be to create the list from an array:

```ts
import { List } from 'immutable'

let l = List([1, 2, 3, 4])
for(let x of l) console.log(x)
```

Note that `l` has type `List<number>`. Even though we did not have type it explicitly, TypeScript has been able to guess it thanks to the mechanism of _type inference_. Handy! If we changed our code to:

```ts
let l = List([1, 2, 3, 4, "a", "b"])
```

Then the type of `l` would become `List<number|string>`. The following code would thus be inconsistent and cause a compiler error, because clearly the intentions of the developer are unclear:

```ts
let l:List<number> = List([1, 2, 3, 4, "a", "b"])
```

The error generated is actually quite reasonable:

```sh
error TS2322: Type 'List<string | number>' is not assignable to type 'List<number>'
```

Lists in immutablejs are materialized collections. A list is an actual container of the actual elements. Immutablejs heavily leans on the principle of laziness: whenever we produce a new collection, this new collection is not materialized immediately, but rather the "recipe" to eventually materialize the collection. Thanks to laziness we avoid creating too many copies of collections, which saves both memory and processing time. Let's see this in action!

We can create a lazy sequence with, for example, the `Range` operator. If we wrote the following:

```ts
let l = Range(1, 10)
for(let x of l) console.log(x)
```

Then we would get to see all the numbers from `1` to `10` on the screen, _as if they were stored inside_ `l`. But let's not be fooled by appearances: `l` has type `Seq.Indexed<number>`, meaning that it does not contain the numbers `1` through `10` in memory, but just a definition of the `Range` so that the elements can be produced one by one **on demand**. We can see this in action because if we print `l` itself with `console.log(l)`, we see the following:

```sh
Range { _start: 1, _end: 10, _step: 1, size: 9 }
```

That is we don't see the contents one element after the next, but we do see the "recipe" for finding them. We could even use this mechanism to create an infinite sequence without running out of memory:

```ts
let l = Range(1)
```

Which, if printed, would show the following:

```sh
Range { _start: 1, _end: Infinity, _step: 1, size: Infinity }
```

While we cannot store infinitely many values in memory, we can store a _recipe_ for infinitely many values. 

> Such an object is sometimes called a _stream_, and examples of _streams_ that can be legitimately infinite in size we have: the stream of all packets coming in from the network, the stream of all mouse movements, the stream of all keyboard presses, etc. Streams are powerful and useful!

We could even iterate through an infinite stream:

```ts
for(let x of l) console.log(x)
```

but don't wait too long for it to finish :)


We can always convert a stream to a concrete collection, even though this is not allowed (your program will crash) for infinite collections so let's go back to a smaller sequence. This conversion is done with operators such as `toArray`, `toList`, and so on:

```ts
let l = Range(1, 4)
console.log(l)
console.log(l.toArray())
console.log(l.toList())
```

You can see that printing the converted values gives an insight in how these collections are stored. For a collection of only three elements the advantage is not evident, but if the elements were hundreds or thousands then you would clearly see how the range would take a lot less memory than the alternatives.

```sh
Range { _start: 1, _end: 4, _step: 1, size: 3 }
[ 1, 2, 3 ]
List {
  size: 3,
  _origin: 0,
  _capacity: 3,
  _level: 5,
  _root: null,
  _tail: VNode { array: [ 1, 2, 3 ], ownerID: undefined },
  __ownerID: undefined,
  __hash: undefined,
  __altered: false
}
```

All collections in immutablejs support the usual transformations such as `map`, `filter`, and many many more. Refer to the documentation for more information about all of the available operators please, but for now let's play around with the basic elements.

We can for example use `map` to transform all elements of a collection at once, producing a new collection with the transformed elements. For example:

```ts
let l1 = Range(1, 4)
let l2 = l1.map(_ => _ + 1)
console.log(l1.toArray())
console.log(l2.toArray())
```

will result in:

```sh
[ 1, 2, 3 ]
[ 2, 3, 4 ]
```

If `l1` had been very large, then `l2` would also result in an array of similar size. Sometimes it's best not to invoke `toArray` and just let laziness prevent too many collections being created:

```ts
Range { _start: 1, _end: 4, _step: 1, size: 3 }
Seq {
  size: 3,
  has: [Function (anonymous)],
  get: [Function (anonymous)],
  __iterateUncached: [Function (anonymous)],
  __iteratorUncached: [Function (anonymous)]
}
```

Notice that the result of `map`, when we do not invoke `toArray`, `toList`, or any other materialization operator, will be kept in this lazy format: the original collection, as well as the lambda together with the instructions to calculate the next element will be there, but not the element themselves.

In practice, we will sometimes apply `map` and `filter` many times in cascade, list this:

```ts
let l = Range(1, 4)
  .map(_ => _ + 1)
  .map(_ => _ * 2)
  .map(_ => _ - 1)
  .filter(_ => _ >= 0)
  .toList()
```

By invoking `toList` only at the very end, we do not end up creating lots and lots of temporary lists that are single-use only and that would need to be garbage-collected almost immediately right after creation. This will save both memory and CPU time. The effect is particularly dramatic when the result is much smaller than the initial collection:

```ts
let l = Range(1, 1000000)
  .map(_ => _ + 1)
  .map(_ => _ * 2)
  .map(_ => _ - 1)
  .take(10)
  .filter(_ => _ >= 0)
  .toList()
console.log(l)
```

The code above will only start calculating on the result of `take(10)`, which only reads the first 10 elements and skips the rest. The fact that the original sequence contains up to a million elements does not play any role whatsoever, and the computation is thereby reduced to at most ten elements (which are much faster to process than a million.)

This whole thing gets even more interesting when dealing with infinite collections and their processing, which is actually made possible by laziness:

```ts
let l = Range(1)
  .map(_ => _ + 1)
  .map(_ => _ * 2)
  .map(_ => _ - 1)
  .take(10)
  .filter(_ => _ >= 0)
  .toList()
console.log(l)
```

If we attempted to materialize the result of the first `map` operator the whole program would crash because, well, the `map` of an infinite collection cannot be materialized. In this extreme case laziness actually enables us to write code that would be outright impossible without laziness.

We close this section with a very useful collection: the `Map`. Maps are similar to objects in that they connect keys to values, with one important note: the keys and the values are dynamic. The most useful property of maps is not that they can store keys and value connected to each other, but rather that they are the fastest and most optimized way we have to _find_ a value given its key. Speed is thus the core advantage of maps.

Let's start with a simple example: let's store a map of users, grouped by their respective id:

```ts
import { Map } from 'immutable'

type User = { id:string, name:string, surname:string, age:number }
let users:Map<User["id"], User> = Map()
const addUser = (newUser:User) : void => {
  users = users.set(newUser.id, newUser)
}

addUser({ id:"12345", name:"John", surname:"Doe", age:27 })
addUser({ id:"abcde", name:"Jane", surname:"Doe", age:29 })
addUser({ id:"123ef", name:"Jack", surname:"Doe", age:31 })
addUser({ id:"ghijk", name:"Jorg", surname:"Doe", age:33 })

console.log(users.has("12345"))
console.log(users.has("7890"))

console.log(users.get("12345"))
console.log(users.get("7890"))
```

We use the `set` operator to bind a key to its respective value. `has` tells us whether or not a given key is present in the map. `get` fetches the value related to a given key, and returns `undefined` if such a value is not present. The code will produce as output:

```ts
true
false
{ id: '12345', name: 'John', surname: 'Doe', age: 27 }
undefined
```

because the key `12345` does exist in the map, whereas the key `7890` does not.

> Notice how, in order to avoid dangerous and error prone repetition of keys, we have defined a utility function `addUser` that first creates the user, and then adds it by its `id` to the `Map`.

Let's see how much faster a `Map` is when compared with, say, a `List`. The following (longish) snippet will add the same random users to a list and a map, and then we lookup the users by ids, scrambled randomly so that we don't even lookup the ids in a straightforward order for an extra challenge. Looking up in the map uses a super fast optimization algorithm based on search trees, whereas the list needs to perform a linear scan of potentially all the elements one after the other.


```ts
const crypto = require("crypto")
import { List, Map } from 'immutable'

type User = { id:string, name:string, surname:string, age:number }
let usersMap:Map<User["id"], User> = Map()
let usersList:List<User> = List()

const addUser = (newUser:User) : void => {
  usersMap = usersMap.set(newUser.id, newUser)
  usersList = usersList.push(newUser)
}

const addRandomUser = () : void => {
  addUser({ id:crypto.randomUUID(), name:crypto.randomUUID(), surname:crypto.randomUUID(), age:Math.random() * 50 + 15 })
}

let numberOfUsers = 100000
let numberOfLookups = 1000
for (let i = 0; i < numberOfUsers; i++)
  addRandomUser()

let userIds = usersMap.keySeq().sortBy(_ => Math.random() > 0.5).toArray()
let mapBenchmarkStart = Date.now()
for (let _ = 0; _ < numberOfLookups; _++) {
  let user = usersMap.get(userIds[_])  
}
let mapBenchmarkEnd = Date.now()

let listBenchmarkStart = Date.now()
for (let _ = 0; _ < numberOfLookups; _++) {
  let user = usersList.find(u => u.id == userIds[_])
}
let listBenchmarkEnd = Date.now()

console.log(mapBenchmarkEnd - mapBenchmarkStart)
console.log(listBenchmarkEnd - listBenchmarkStart)
```

The results will be quite dramatic. The precise numbers depend of course on the hardware, but differences such as:

```sh
1
2815
```

are to be expected, meaning that list lookups are orders of magnitude slower than maps!

A final note about what happens when something like

```ts
usersMap = usersMap.set(newUser.id, newUser)
usersList = usersList.push(newUser)
```

is performed. On the surface it almost looks like `set` and `push` create a full blown new container with all the values of the original plus a new one. If this map were a full copy, this would result in ...


### Object oriented programming
classes
interfaces
inheritance
decorators



# Extra reading materials
...fill this list up...
https://www.typescriptlang.org/docs/handbook/utility-types.html
https://www.typescriptlang.org/docs/handbook/advanced-types.html
https://www.typescriptlang.org/docs/handbook/2/types-from-types.html

