
// tokenizer: group into tokens based on whitespace
const tokenize = (str) => {
    const tokens = [];

    let lineNumber = 1;
    let columnNumber = 1;
    let currPartialToken = "";

    const pushToken = () => currPartialToken && tokens.push({
        token: currPartialToken,
        lineNumber: lineNumber,
        columnNumber: columnNumber - currPartialToken.length,
    })

    const pushChar = (currChar) => tokens.push({
        token: currChar,
        lineNumber: lineNumber,
        // -1 for length, + 1 for col num increment
        // after each iteration
        columnNumber: columnNumber - 1 + 1,
    })

    // make sure all tokens are pushed out
    str += "\n";
    let prevChar = -1;
    let nextChar = -1;
    for (let i = 0; i < str.length; i++) {
        const currChar = str.charAt(i);
        nextChar = str.charAt(i + 1) || -1;

        switch (currChar) {
            case "\n":
                pushToken();
                pushChar(currChar);

                // update line and column nums
                lineNumber++;
                columnNumber = 0;
                currPartialToken = "";

                break;
            case " ":
            case "\t":
                pushToken();
                currPartialToken = "";
                break;

            // TODO consider splitting out ()[]{} into separate
            // cases since they should separate from the others
            // as separate tokens
            case "!": case "\"": case "#": case "$": case "%":
            case "&": case "'": case "(": case ")": case "*":
            case "+": case ",": case "-": case ".": case "/":
            case ":": case ";": case "<": case "=": case ">":
            case "?": case "@": case "[": case "\\": case "]":
            case "^": case "_": case "`": case "{": case "|":
            case "}":
                // prevChar or nextChar is a special char ;
                // this means that the token will be continued
                // so we just keep adding to the token
                if (prevChar == "!" || prevChar == "\"" || prevChar == "#" ||
                    prevChar == "$" || prevChar == "%" || prevChar == "&" ||
                    prevChar == "'" || prevChar == "(" || prevChar == ")" ||
                    prevChar == "*" || prevChar == "+" || prevChar == "," ||
                    prevChar == "-" || prevChar == "." || prevChar == "/" ||
                    prevChar == ":" || prevChar == ";" || prevChar == "<" ||
                    prevChar == "=" || prevChar == ">" || prevChar == "?" ||
                    prevChar == "@" || prevChar == "[" || prevChar == "\\" ||
                    prevChar == "]" || prevChar == "^" || prevChar == "_" ||
                    prevChar == "`" || prevChar == "{" || prevChar == "|" ||
                    prevChar == "}" ||

                    nextChar == "!" || nextChar == "\"" || nextChar == "#" ||
                    nextChar == "$" || nextChar == "%" || nextChar == "&" ||
                    nextChar == "'" || nextChar == "(" || nextChar == ")" ||
                    nextChar == "*" || nextChar == "+" || nextChar == "," ||
                    nextChar == "-" || nextChar == "." || nextChar == "/" ||
                    nextChar == ":" || nextChar == ";" || nextChar == "<" ||
                    nextChar == "=" || nextChar == ">" || nextChar == "?" ||
                    nextChar == "@" || nextChar == "[" || nextChar == "\\" ||
                    nextChar == "]" || nextChar == "^" || nextChar == "_" ||
                    nextChar == "`" || nextChar == "{" || nextChar == "|" ||
                    nextChar == "}") {
                    currPartialToken += currChar;
                }
                else {
                    pushToken();
                    pushChar(currChar);
                    currPartialToken = "";
                }

                break;
            // nums
            case "0": case "1": case "2": case "3": case "4":
            case "5": case "6": case "7": case "8": case "9":

            // uppercase letters
            case "A": case "B": case "C": case "D": case "E":
            case "F": case "G": case "H": case "I": case "J":
            case "K": case "L": case "M": case "N": case "O":
            case "P": case "Q": case "R": case "S": case "T":
            case "U": case "V": case "W": case "X": case "Y":
            case "Z":

            // lowercase letters
            case "a": case "b": case "c": case "d": case "e":
            case "f": case "g": case "h": case "i": case "j":
            case "k": case "l": case "m": case "n": case "o":
            case "p": case "q": case "r": case "s": case "t":
            case "u": case "v": case "w": case "x": case "y":
            case "z":
                currPartialToken += currChar;
                break;
            default:
                throw new Error(`Invalid char '${currChar}' [${lineNumber}:${columnNumber}]`);
        }

        prevChar = currChar;

        columnNumber++;

    }

    return tokens
}
