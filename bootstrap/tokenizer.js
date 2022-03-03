// tokenizer: group together characters of the same type
// this will be shared between both bermuda and float

const counter = (() => {
    let count = 0;
    return (resetCounter) => {
        if (resetCounter) count = 0;
        return count++;
    }
})();

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

const tokenize = (str) => {
    const tokens = [];

    let lineNum = 1, colNum = 1;
    let prevChar = "", currChar = "", nextChar = "";
    let currToken = "";

    const pushNonEmptyToken = (colNumOffset = 0) => currToken &&
        tokens.push({ token: currToken, lineNum, colNum: colNum - currToken.length + colNumOffset })
    const pushCurrChar = () => tokens.push({
        token: currChar, lineNum, colNum: colNum - currChar.length + 1
    })
    const clearCurrToken = () => currToken = "";
    const extendTokenForCharTypes = (acceptedCharTypes) => {
        const acceptNextCharType = acceptedCharTypes.includes(CHAR_TYPE[nextChar]);
        if (acceptNextCharType) {
            currToken += currChar;
        }
        else {
            // we don't accept next char
            // so we finish the token off
            currToken += currChar;
            pushNonEmptyToken(1);
            clearCurrToken();
        }
    }
    const emitSingleToken = () => {
        pushNonEmptyToken();// push everything we have so far
        pushCurrChar();// make this its own token
        clearCurrToken();// prevent new tokens from attaching to this one
    }

    for (let i = 0; i < str.length; i++) {
        currChar = str.charAt(i);
        nextChar = str.charAt(i + 1) || "";

        if (CHAR_TYPE[prevChar] === CHAR_SPECIAL_BACKSLASH && 
            currToken === "\\") {
            // backslash escaping only ever has two characters
            currToken += currChar;
            pushNonEmptyToken(1);
            clearCurrToken();
            continue;
        }

        switch (CHAR_TYPE[currChar]) {
            case CHAR_NEWLINE:
                emitSingleToken()

                // bookkeeping indices
                lineNum++;
                colNum = 0; // this will be incremented after so start at 0
                break;
            case CHAR_WHITESPACE:
                extendTokenForCharTypes([CHAR_WHITESPACE]);
                break;
            case CHAR_SPECIAL_BACKSLASH:
                pushNonEmptyToken();// push everything we have so far
                currToken = currChar;// make sure backslash is the start of the token
                // the rest of the logic is handled up top
                break;
            case CHAR_SPECIAL_SLASH:
                extendTokenForCharTypes([CHAR_SPECIAL_SLASH]);
                break;
            case CHAR_SPECIAL_ORDINARY:
                extendTokenForCharTypes([CHAR_SPECIAL_ORDINARY]);
                break;
            case CHAR_SPECIAL_DOUBLE_QUOTE:
            case CHAR_SPECIAL_SINGLE_QUOTE:
                emitSingleToken()
                break;
            case CHAR_SPECIAL_PARENTHESES_LEFT:
                extendTokenForCharTypes([CHAR_SPECIAL_PARENTHESES_LEFT]);
                break;
            case CHAR_SPECIAL_PARENTHESES_RIGHT:
                extendTokenForCharTypes([CHAR_SPECIAL_PARENTHESES_RIGHT]);
                break;
            case CHAR_SPECIAL_SQUARE_BRACKETS_LEFT:
                extendTokenForCharTypes([CHAR_SPECIAL_SQUARE_BRACKETS_LEFT]);
                break;
            case CHAR_SPECIAL_SQUARE_BRACKETS_RIGHT:
                extendTokenForCharTypes([CHAR_SPECIAL_SQUARE_BRACKETS_RIGHT]);
                break;
            case CHAR_SPECIAL_CURLY_BRACES_LEFT:
                extendTokenForCharTypes([CHAR_SPECIAL_CURLY_BRACES_LEFT]);
                break;
            case CHAR_SPECIAL_CURLY_BRACES_RIGHT:
                extendTokenForCharTypes([CHAR_SPECIAL_CURLY_BRACES_RIGHT]);
                break;
            case CHAR_DIGIT:
            case CHAR_LETTER_UPPER_CASE:
            case CHAR_LETTER_LOWER_CASE:
                extendTokenForCharTypes([CHAR_DIGIT, CHAR_LETTER_UPPER_CASE, CHAR_LETTER_LOWER_CASE]);
                break;
            default:
                throw new Error(`${lineNum}:${colNum}: Invalid UTF-8 character \`${currChar}\``)
        }

        prevChar = currChar;
        colNum++;
    }
    return tokens;
}