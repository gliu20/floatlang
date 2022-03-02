# floatlang | ece project
An ahead-of-time compiled, declarative, no-garbage programming
language with optional JIT-optimizing capabilities

- built-in data structs
    - skip lists
    - doubly linked lists
    - dynamic arrays
    - hash tables
    - structs
- data polymorphism: carrier/cargo
- strategy pattern: decl/do/impl/action
    - separates declaration of behavior from the implementation of 
      that behaviour
    - impure functions can only be run in the implement block
- ownership/borrowing for maintaining heap
- model-based language?

# Documentation
## Operations

### Math
| op | description |
| --- | --- |
| x + y | add |
| x - y | subtract |
| x * y | multiply |
| - x | negate |


### Bitwise
| op | description |
| --- | --- |
| x ^ y | xor |
| x \| y | or |
| x & y | and |
| ~ x | not |
| x >> y | right shift |
| x << y | left shift |

## Logic ops
| op | description |
| --- | --- |
| x && y | and |
| x \|\| y | or |
| !x | not |

## Control Flow
```c
if {}
else {}
while () {}
for () {}
switch () {
    case x:
        break
    default:
}
do {} while ()

break
continue
return
```

## Functions
```
const fn return_type name = () => {}
```

## Variables
```
const type name = initial_value
```

## Struct
```
struct name {
    type name1
    type name2
    type name3
}
```


## Carrier Cargo
### Structs
```
struct name (carrier) {
    type name1
    type name2
    cargo
}
```

### Functions
```
fn name (const carrier return_type) = () => {

    // some code
    cargo
    // some other code

}
```



## Syntax
A program is a series of statements

### Constructs
Constructs are a special type of statement. Constructs are the building blocks 
for control flow, like for, while, functions, switch, and if-else statements
```
CONSTRUCT

KEYWORD OPTIONAL_TYPE OPTIONAL_IDENTIFIER OPTIONAL_(MODIFIERS) STATEMENT_BLOCK
```

### Assignment
This is a special statement that creates a variable and optionally initializes it to a value
```
KEYWORD OPTIONAL_TYPE IDENTIFIER OPTIONAL_= OPTIONAL_VALUE
```

KEYWORDS = {
    // control flow
    "for",
    "while",
    "switch",
    "if",
    "else",

    // functions
    "fn",

    // assignment
    "let",
    "const",
}