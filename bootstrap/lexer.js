const STATEMENT = "TOKENS NEWLINE";
const STATEMENTS = "STATEMENT+";
const BLOCK_OF_STATEMENTS = "{ STATEMENTS }";// is a type of statement;

const CONSTRUCT = "KEYWORD TYPE? IDENTIFIER? (MODIFIERS?) STATEMENT";// is a type of statement;
const ASSIGNMENT = "KEYWORD TYPE? IDENTIFIER || KEYWORD TYPE? IDENTIFIER = EXPRESSION";


// lexer: uses context to assign meaning to tokens