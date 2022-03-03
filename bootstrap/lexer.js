// lexer: uses context to assign meaning to tokens

const bermudaLexDescription = {
    tokenTypes: [
        {
            name: "KEYWORD",
            isToken: (token) => /^(if|while|proc|let|peek|in|end)$/i.test(token)
        },
        {
            name: "OP",
            isToken: (token) => /^(\+|\-)$/i.test(token)
        },
        {
            name: "NUMERIC_LITERAL",
            isToken: (token) => /(^0[box][0-9a-f]+$|^[0-9]+$)/i.test(token)
        },
        {
            name: "IDENTIFIER",
            isToken: (token) => /^[a-z_][a-z_0-8]*$/i.test(token)
        },
        {
            name: "NEW_LINE",
            isToken: (token) => /^\n$/i.test(token)
        },
    ]
};

const lex = (tokens, lexicalDescription) => {
    const annotate = (token) => {
        for (let tokenDetector of lexicalDescription.tokenTypes) {
            if (tokenDetector.isToken(token.token)) {
                token.type = tokenDetector.name
                return;
            }
        }
        throw new Error(`Invalid token: \`${token.token}\` [${token.lineNumber}:${token.columnNumber}]`)
    }

    tokens.forEach(annotate)
}