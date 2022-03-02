# Compiler Architecture
The compiler is a multi-stage system that successfully lowers
code down through successive intermediate representations (IR)

```
FLOAT --> BERMUDA --> x86_64 ASM
```

## Assembly
x86_64 Assembly is specific to the AT&T syntax of GNU gas which
is available on most linux distributions 

## Bermuda
Bermuda is a custom stack-based language that abstracts away
the tedious or difficult parts of assembly. It is similar to
the WebAssembly Text format.

