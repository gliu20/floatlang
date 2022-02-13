# floatlang | ece project
A no garbage programming language with a stack and a tree-based heap

- custom data structure = skip list?
- carriers
- function slots?
- everything pure by design
- explicitly declare side effects
- borrowing / some sort of garbage collecting scheme
- model-based language?


source to source compiler --> compiles down to c that can then be compiled to machine code


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

