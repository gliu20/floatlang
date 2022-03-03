// bermuda is the IR that higher level concepts are expressed in
// floatlang is just syntactic sugar for bermuda code


// in bermuda, we have several constructs
// if end
// while end
// proc end
// let in end
// peek in end
// syscall_1 ... syscall_6

// to make IR lowering easier, bermuda expressions are written
// in reverse polish notation

// helper for enum
const counter = (() => {
    let count = 0;
    return (resetCounter) => {
        if (resetCounter) count = 0;
        return count++;
    }
})();

const OP_ADD = counter(true);
const OP_SUB = counter();
const OP_COUNT = counter();

const KEYWORD_IF = counter(true);
const KEYWORD_WHILE = counter();
const KEYWORD_PROC = counter();
const KEYWORD_LET = counter();
const KEYWORD_PEEK = counter();
const KEYWORD_IN = counter();
const KEYWORD_END = counter();
const KEYWORD_COUNT = counter();

const compileBermudaProgram = (program) => {
    const tokens = tokenize(program);
    const lexedTokens = lex(tokens, lexicalDescription);
}