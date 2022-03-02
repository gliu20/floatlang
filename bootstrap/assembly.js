
// helper for enum
const counter = (() => {
    let count = 0;
    return (resetCounter) => {
        if (resetCounter) count = 0;
        return count++;
    }
})()

// data ops enum
const OP_DATA_MOV = counter(true);
const OP_DATA_PUSH = counter();
const OP_DATA_POP = counter();
const OP_DATA_LEA = counter();
const OP_DATA_COUNT = counter();

// math ops enum
const OP_MATH_ADD = counter(true);
const OP_MATH_SUB = counter();
const OP_MATH_INC = counter();
const OP_MATH_DEC = counter();
const OP_MATH_IMUL = counter();
const OP_MATH_IDIV = counter();
const OP_MATH_AND = counter();
const OP_MATH_XOR = counter();
const OP_MATH_OR = counter();
const OP_MATH_NOT = counter();
const OP_MATH_NEG = counter();
const OP_MATH_SHL = counter();
const OP_MATH_SHR = counter();
const OP_MATH_COUNT = counter();

// math ops enum
const OP_CTRL_JMP = counter(true);
const OP_CTRL_JE = counter();
const OP_CTRL_JNE = counter();
const OP_CTRL_JZ = counter();
const OP_CTRL_JG = counter();
const OP_CTRL_JGE = counter();
const OP_CTRL_JL = counter();
const OP_CTRL_JLE = counter();
const OP_CTRL_CMP = counter();
const OP_CTRL_CALL = counter();
const OP_CTRL_RET = counter();
const OP_CTRL_COUNT = counter();

// this interprets assembly code (for ease of debugging)
const simulateAsmProgram = (program) => {
    const stack = [];
    let instructionPtr = 0;


};
const compileAsmProgram = (program) => {};