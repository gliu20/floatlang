

const counter = (() => {
    let count = 0;
    return (resetCounter) => {
        if (resetCounter) count = 0;
        return count++;
    }
})();


// strategies for merging tokens
// LINE_END         --> specific to handling lineNum and colNum
// GROUP_SIMILAR    --> token is a contiguous seq of chars of the same type
// ENTER_MODE       --> no token is emitted, but mode is changed
const STRATEGY_LINE_END = counter(true);
const STRATEGY_GROUP_SIMILAR = counter();
const STRATEGY_ENTER_MODE = counter();

// types of modes
// DEFAULT  --> built-in
// ESCAPE   --> backslash escape sequences
// COMMENT  --> single line and multi-line comments
// QUOTE    --> single quote and double quote
const MODE_DEFAULT = counter(true);
const MODE_ESCAPE = counter();
const MODE_COMMENT = counter();
const MODE_QUOTE = counter();

// character types
// these char types are used in the MODE strategy to pick the
// mode and for grouping in the GROUP_SIMILAR strategy
const CHAR_NEWLINE = counter(true);
const CHAR_WHITESPACE = counter();
const CHAR_SPECIAL_DOUBLE_QUOTE = counter();
const CHAR_SPECIAL_SINGLE_QUOTE = counter();
const CHAR_SPECIAL_PARENTHESES_LEFT = counter();
const CHAR_SPECIAL_PARENTHESES_RIGHT = counter();
const CHAR_SPECIAL_SQUARE_BRACKETS_LEFT = counter();
const CHAR_SPECIAL_SQUARE_BRACKETS_RIGHT = counter();
const CHAR_SPECIAL_CURLY_BRACES_LEFT = counter();
const CHAR_SPECIAL_CURLY_BRACES_RIGHT = counter();
const CHAR_SPECIAL_BACKSLASH = counter();
const CHAR_SPECIAL_SLASH = counter();
const CHAR_SPECIAL_ORDINARY = counter();
const CHAR_DIGIT = counter();
const CHAR_LETTER_UPPER_CASE = counter();
const CHAR_LETTER_LOWER_CASE = counter();

const CHAR_TYPE = {
    // whitespace
    "\n": CHAR_NEWLINE, " ": CHAR_WHITESPACE, "\t": CHAR_WHITESPACE,

    // special chars that enclose contexts
    "\"": CHAR_SPECIAL_DOUBLE_QUOTE, "'": CHAR_SPECIAL_SINGLE_QUOTE,
    "(": CHAR_SPECIAL_PARENTHESES_LEFT, ")": CHAR_SPECIAL_PARENTHESES_RIGHT,
    "[": CHAR_SPECIAL_SQUARE_BRACKETS_LEFT, "]": CHAR_SPECIAL_SQUARE_BRACKETS_RIGHT,
    "{": CHAR_SPECIAL_CURLY_BRACES_LEFT, "}": CHAR_SPECIAL_CURLY_BRACES_RIGHT,

    // escaping
    "\\": CHAR_SPECIAL_BACKSLASH,

    // forward slash
    "/": CHAR_SPECIAL_SLASH,

    // ordinary special chars
    "!": CHAR_SPECIAL_ORDINARY, "#": CHAR_SPECIAL_ORDINARY,
    "$": CHAR_SPECIAL_ORDINARY, "%": CHAR_SPECIAL_ORDINARY,
    "&": CHAR_SPECIAL_ORDINARY, "*": CHAR_SPECIAL_ORDINARY,
    "+": CHAR_SPECIAL_ORDINARY, ",": CHAR_SPECIAL_ORDINARY,
    "-": CHAR_SPECIAL_ORDINARY, ".": CHAR_SPECIAL_ORDINARY,
    ":": CHAR_SPECIAL_ORDINARY,
    ";": CHAR_SPECIAL_ORDINARY, "<": CHAR_SPECIAL_ORDINARY,
    "=": CHAR_SPECIAL_ORDINARY, ">": CHAR_SPECIAL_ORDINARY,
    "?": CHAR_SPECIAL_ORDINARY, "@": CHAR_SPECIAL_ORDINARY,
    "^": CHAR_SPECIAL_ORDINARY, "_": CHAR_SPECIAL_ORDINARY,
    "`": CHAR_SPECIAL_ORDINARY, "|": CHAR_SPECIAL_ORDINARY,

    // digits
    "0": CHAR_DIGIT, "1": CHAR_DIGIT, "2": CHAR_DIGIT, "3": CHAR_DIGIT, "4": CHAR_DIGIT,
    "5": CHAR_DIGIT, "6": CHAR_DIGIT, "7": CHAR_DIGIT, "8": CHAR_DIGIT, "9": CHAR_DIGIT,

    // uppercase letters
    "A": CHAR_LETTER_UPPER_CASE, "B": CHAR_LETTER_UPPER_CASE, "C": CHAR_LETTER_UPPER_CASE,
    "D": CHAR_LETTER_UPPER_CASE, "E": CHAR_LETTER_UPPER_CASE, "F": CHAR_LETTER_UPPER_CASE,
    "G": CHAR_LETTER_UPPER_CASE, "H": CHAR_LETTER_UPPER_CASE, "I": CHAR_LETTER_UPPER_CASE,
    "J": CHAR_LETTER_UPPER_CASE, "K": CHAR_LETTER_UPPER_CASE, "L": CHAR_LETTER_UPPER_CASE,
    "M": CHAR_LETTER_UPPER_CASE, "N": CHAR_LETTER_UPPER_CASE, "O": CHAR_LETTER_UPPER_CASE,
    "P": CHAR_LETTER_UPPER_CASE, "Q": CHAR_LETTER_UPPER_CASE, "R": CHAR_LETTER_UPPER_CASE,
    "S": CHAR_LETTER_UPPER_CASE, "T": CHAR_LETTER_UPPER_CASE, "U": CHAR_LETTER_UPPER_CASE,
    "V": CHAR_LETTER_UPPER_CASE, "W": CHAR_LETTER_UPPER_CASE, "X": CHAR_LETTER_UPPER_CASE,
    "Y": CHAR_LETTER_UPPER_CASE, "Z": CHAR_LETTER_UPPER_CASE,

    // lowercase letters
    "a": CHAR_LETTER_LOWER_CASE, "b": CHAR_LETTER_LOWER_CASE, "c": CHAR_LETTER_LOWER_CASE,
    "d": CHAR_LETTER_LOWER_CASE, "e": CHAR_LETTER_LOWER_CASE, "f": CHAR_LETTER_LOWER_CASE,
    "g": CHAR_LETTER_LOWER_CASE, "h": CHAR_LETTER_LOWER_CASE, "i": CHAR_LETTER_LOWER_CASE,
    "j": CHAR_LETTER_LOWER_CASE, "k": CHAR_LETTER_LOWER_CASE, "l": CHAR_LETTER_LOWER_CASE,
    "m": CHAR_LETTER_LOWER_CASE, "n": CHAR_LETTER_LOWER_CASE, "o": CHAR_LETTER_LOWER_CASE,
    "p": CHAR_LETTER_LOWER_CASE, "q": CHAR_LETTER_LOWER_CASE, "r": CHAR_LETTER_LOWER_CASE,
    "s": CHAR_LETTER_LOWER_CASE, "t": CHAR_LETTER_LOWER_CASE, "u": CHAR_LETTER_LOWER_CASE,
    "v": CHAR_LETTER_LOWER_CASE, "w": CHAR_LETTER_LOWER_CASE, "x": CHAR_LETTER_LOWER_CASE,
    "y": CHAR_LETTER_LOWER_CASE, "z": CHAR_LETTER_LOWER_CASE,
};

const CHAR_TYPE_STRATEGY = [
    STRATEGY_LINE_END,          // CHAR_NEWLINE
    STRATEGY_GROUP_SIMILAR,     // CHAR_WHITESPACE
    STRATEGY_ENTER_MODE,        // CHAR_SPECIAL_DOUBLE_QUOTE
    STRATEGY_ENTER_MODE,        // CHAR_SPECIAL_SINGLE_QUOTE
    STRATEGY_GROUP_SIMILAR,     // CHAR_SPECIAL_PARENTHESES_LEFT
    STRATEGY_GROUP_SIMILAR,     // CHAR_SPECIAL_PARENTHESES_RIGHT
    STRATEGY_GROUP_SIMILAR,     // CHAR_SPECIAL_SQUARE_BRACKETS_LEFT
    STRATEGY_GROUP_SIMILAR,     // CHAR_SPECIAL_SQUARE_BRACKETS_RIGHT
    STRATEGY_GROUP_SIMILAR,     // CHAR_SPECIAL_CURLY_BRACES_LEFT
    STRATEGY_GROUP_SIMILAR,     // CHAR_SPECIAL_CURLY_BRACES_RIGHT
    STRATEGY_ENTER_MODE,        // CHAR_SPECIAL_BACKSLASH
    STRATEGY_ENTER_MODE,        // CHAR_SPECIAL_SLASH
    STRATEGY_GROUP_SIMILAR,     // CHAR_SPECIAL_ORDINARY
    STRATEGY_GROUP_SIMILAR,     // CHAR_DIGIT
    STRATEGY_GROUP_SIMILAR,     // CHAR_LETTER_UPPER_CASE
    STRATEGY_GROUP_SIMILAR,     // CHAR_LETTER_LOWER_CASE
]



const CHAR_TYPE_MODE_SWITCH = [
    null,                   // CHAR_NEWLINE
    null,                   // CHAR_WHITESPACE
    MODE_QUOTE,             // CHAR_SPECIAL_DOUBLE_QUOTE
    MODE_QUOTE,             // CHAR_SPECIAL_SINGLE_QUOTE
    null,                   // CHAR_SPECIAL_PARENTHESES_LEFT
    null,                   // CHAR_SPECIAL_PARENTHESES_RIGHT
    null,                   // CHAR_SPECIAL_SQUARE_BRACKETS_LEFT
    null,                   // CHAR_SPECIAL_SQUARE_BRACKETS_RIGHT
    null,                   // CHAR_SPECIAL_CURLY_BRACES_LEFT
    null,                   // CHAR_SPECIAL_CURLY_BRACES_RIGHT
    MODE_ESCAPE,            // CHAR_SPECIAL_BACKSLASH
    MODE_COMMENT,           // CHAR_SPECIAL_SLASH
    null,                   // CHAR_SPECIAL_ORDINARY
    null,                   // CHAR_DIGIT
    null,                   // CHAR_LETTER_UPPER_CASE
    null,                   // CHAR_LETTER_LOWER_CASE

];


const CHAR_GROUPS = [
    [],                                                             // CHAR_NEWLINE
    [CHAR_WHITESPACE],                                              // CHAR_WHITESPACE
    [],                                                             // CHAR_SPECIAL_DOUBLE_QUOTE
    [],                                                             // CHAR_SPECIAL_SINGLE_QUOTE
    [CHAR_SPECIAL_PARENTHESES_LEFT],                                // CHAR_SPECIAL_PARENTHESES_LEFT
    [CHAR_SPECIAL_PARENTHESES_RIGHT],                               // CHAR_SPECIAL_PARENTHESES_RIGHT
    [CHAR_SPECIAL_SQUARE_BRACKETS_LEFT],                            // CHAR_SPECIAL_SQUARE_BRACKETS_LEFT
    [CHAR_SPECIAL_SQUARE_BRACKETS_RIGHT],                           // CHAR_SPECIAL_SQUARE_BRACKETS_RIGHT
    [CHAR_SPECIAL_CURLY_BRACES_LEFT],                               // CHAR_SPECIAL_CURLY_BRACES_LEFT
    [CHAR_SPECIAL_CURLY_BRACES_RIGHT],                              // CHAR_SPECIAL_CURLY_BRACES_RIGHT
    [],                                                             // CHAR_SPECIAL_BACKSLASH
    [],                                                             // CHAR_SPECIAL_SLASH
    [CHAR_SPECIAL_ORDINARY],                                        // CHAR_SPECIAL_ORDINARY
    [CHAR_DIGIT, CHAR_LETTER_UPPER_CASE, CHAR_LETTER_LOWER_CASE],   // CHAR_DIGIT
    [CHAR_DIGIT, CHAR_LETTER_UPPER_CASE, CHAR_LETTER_LOWER_CASE],   // CHAR_LETTER_UPPER_CASE
    [CHAR_DIGIT, CHAR_LETTER_UPPER_CASE, CHAR_LETTER_LOWER_CASE],   // CHAR_LETTER_LOWER_CASE
];

const charTypeOf = (char) => CHAR_TYPE[char];

const makeContext = (str, i) => ({
    currChar: str.charAt(i),
    nextChar: str.charAt(i + 1),
})


const bookkeepNewLine = (state) => state.lineNum++ && (state.colNum = 0);
const bookkeepNewCol = (state) => state.colNum++;

const clearCurrPartialToken = (state) => state.currPartialToken = "";

const emitTokenForCurrChar = (state, context) => ({
    sourceStr: context.currChar,
    lineNum: state.lineNum,
    colNum: state.colNum,
    type: null,
});

const emitTokenWithoutCurrChar = (state) => ({
    sourceStr: state.currPartialToken,
    lineNum: state.lineNum,
    colNum: state.colNum - state.currPartialToken.length,
    type: null,
})

const emitTokenWithCurrChar = (state, context) => ({
    sourceStr: state.currPartialToken + context.currChar,
    lineNum: state.lineNum,
    colNum: state.colNum - state.currPartialToken.length + 1,
    type: null,
})

const extendTokenWithCurrChar = (state, context) =>
    state.currPartialToken += context.currChar;

const extendTokenByGrouping = (state, context, acceptedCharTypes) => {
    let result;

    const { nextChar } = context;
    const nextCharType = charTypeOf(nextChar);
    const willAcceptNextChar = acceptedCharTypes.includes(nextCharType);

    if (willAcceptNextChar) {
        extendTokenWithCurrChar(state, context);
    }
    else {
        result = emitTokenWithCurrChar(state, context);
        clearCurrPartialToken(state);
    }

    return result;
}

const getAcceptedCharTypes = (context) =>
    CHAR_GROUPS[charTypeOf(context.currChar)]




const buildTokenUsingStrategy__line_end = (state, context) => {
    let result = [];

    const tokenThusFar = emitTokenWithoutCurrChar(state);
    const tokenNewLine = emitTokenForCurrChar(state, context);

    if (tokenThusFar) result.push(tokenThusFar);
    if (tokenNewLine) result.push(tokenNewLine);

    clearCurrPartialToken(state);
    bookkeepNewLine(state);
    bookkeepNewCol(state);

    return result;
}

const buildTokenUsingStrategy__group_similar = (state, context) => {
    let result = [];

    const acceptedCharTypes = getAcceptedCharTypes(context);
    const groupedToken = extendTokenByGrouping(state, context, acceptedCharTypes);
    if (groupedToken) result.push(groupedToken);

    bookkeepNewCol(state);

    return result;
}

const enterModeByCharType = (state, context) =>
    state.mode = CHAR_TYPE_MODE_SWITCH[charTypeOf(context.currChar)];

const enterDefaultMode = (state) =>
    state.mode = MODE_DEFAULT;

const enterQuoteMode = (state) =>
    state.mode = MODE_QUOTE;

const buildTokenUsingStrategy__enter_mode = (state, context) => {
    let result = [];

    // we would expect to have to run the following code:
    //  ```
    //  const tokenThusFar = emitTokenWithoutCurrChar(state);
    //  if (tokenThusFar) result.push(tokenThusFar);
    //  ```
    // but we don't need to because we group characters
    // by being in the same character class. characters that
    // enter a new mode, by definition, are in a different
    // character class so the currPartialToken is already
    // pushed into the tokens list

    extendTokenWithCurrChar(state, context);
    bookkeepNewCol(state);

    enterModeByCharType(state, context);
    return result;
}

const BUILD_TOKEN_STRATEGIES = [
    buildTokenUsingStrategy__line_end, // STRATEGY_LINE_END
    buildTokenUsingStrategy__group_similar, // STRATEGY_GROUP_SIMILAR
    buildTokenUsingStrategy__enter_mode, // STRATEGY_ENTER_MODE
];

const selectStrategy = (context) =>
    CHAR_TYPE_STRATEGY[charTypeOf(context.currChar)];

const buildTokenUsingStrategy = (state, context) =>
    BUILD_TOKEN_STRATEGIES[selectStrategy(context)](state, context);

const extendAndMaybeEmitToken__default = (state, context) => {
    return buildTokenUsingStrategy(state, context);
}

const extendAndMaybeEmitToken__escape = (state, context) => {
    let result = [];
    if (state.currPartialToken === "\\") {
        const escapeToken = emitTokenWithCurrChar(state, context);
        if (escapeToken) result.push(escapeToken);

        clearCurrPartialToken(state);
        enterQuoteMode(state);
    }

    bookkeepNewCol(state);

    // In the future, we can support hex and unicode
    // escape sequences but we won't be doing that for now
    return result;
};
const extendAndMaybeEmitToken__comment = (state, context) => {
    let result = [];

    const currCharType = charTypeOf(context.currChar);
    const nextCharType = charTypeOf(context.nextChar);

    if (state.currPartialToken.startsWith("//") && nextCharType === CHAR_NEWLINE) {
        const commentToken = emitTokenWithCurrChar(state, context);
        if (commentToken) result.push(commentToken);

        clearCurrPartialToken(state);
        bookkeepNewCol(state);
        enterDefaultMode(state);

        // the next char is newline and we let the default mode handle that
    }
    else if (state.currPartialToken === "/" && currCharType !== CHAR_SPECIAL_SLASH) {
        const slashToken = emitTokenWithoutCurrChar(state);
        if (slashToken) result.push(slashToken);

        clearCurrPartialToken(state);
        bookkeepNewCol(state);
        enterDefaultMode(state);

        // we pushed everything in currPartialToken but we haven't handled currChar
        // so we let it handle it
        const defaultTokens = extendAndMaybeEmitToken__default(state, context);
        result.push(...defaultTokens);
    }
    else {
        extendTokenWithCurrChar(state, context);
        bookkeepNewCol(state);
    }

    return result;
};
const extendAndMaybeEmitToken__quote = (state, context) => {
    let result = [];
    const { currChar, nextChar } = context;
    const currCharType = charTypeOf(context.currChar);
    const nextCharType = charTypeOf(context.nextChar);
    const quoteType = charTypeOf(state.currPartialToken.charAt(0));

    if (quoteType === currCharType) {
        const quoteToken = emitTokenWithCurrChar(state, context);
        if (quoteToken) result.push(quoteToken);

        clearCurrPartialToken(state);
        bookkeepNewCol(state);
        enterDefaultMode(state);
    }
    else if (currChar === "\\") {
        // TODO
    }
    else {
        extendTokenWithCurrChar(state, context);
        bookkeepNewCol(state);
    }

    return result;
};

const MODE_HANDLERS = [
    extendAndMaybeEmitToken__default,   // MODE_DEFAULT
    extendAndMaybeEmitToken__escape,    // MODE_ESCAPE
    extendAndMaybeEmitToken__comment,   // MODE_COMMENT
    extendAndMaybeEmitToken__quote,     // MODE_QUOTE
];

const extendAndMaybeEmitToken = (state, context) =>
    MODE_HANDLERS[state.mode](state, context);

const tokenize = (str) => {
    const tokens = [];

    const state = {
        mode: MODE_DEFAULT,
        lineNum: 1, colNum: 1,
        currPartialToken: "",
    };

    for (let i = 0; i < str.length; i++) {
        const context = makeContext(str, i);
        const result = extendAndMaybeEmitToken(state, context);
        if (result) tokens.push(...result);
    }

    return tokens
}