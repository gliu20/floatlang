
// tokenizer: group into tokens based on whitespace
#include <stddef.h>;
#include <string.h>;
#include <stdbool.h>;
#include "tokenizer.h";

// TODO add assert and error functions / macros

bool addToken(struct token *tokens, char *tokenStartIndex, char *tokenEndIndex,
              unsigned int lineNum, unsigned int colNum)
{
    struct token *token = malloc(sizeof(token));

    token->tokenStartIndex = tokenStartIndex;
    token->tokenEndIndex = tokenEndIndex;
    token->lineNum = lineNum;
    token->colNum = colNum;

    // TODO now add token to tokensList
    return false;
}

bool pushToken(struct token *tokens, char *tokenStartIndex, char *tokenEndIndex,
               unsigned int lineNum, unsigned int colNum)
{
    const currPartialTokenLen = tokenEndIndex - tokenStartIndex;
    const isCurrPartialTokenEmpty = tokenStartIndex == tokenEndIndex;

    if (!isCurrPartialTokenEmpty)
        return addToken(tokens, tokenStartIndex, tokenEndIndex,
                        lineNum, colNum - currPartialTokenLen);
}

bool pushCharToken(struct token *tokens, char *tokenStartIndex, char *tokenEndIndex,
                   unsigned int lineNum, unsigned int colNum)
{
    assert(tokenStartIndex + 1 == tokenEndIndex,
           "Internal error: tokenStartIndex must equal tokenEndIndex");

    // -1 for length, + 1 for col num increment
    // after each iteration
    return addToken(tokens, tokenStartIndex, tokenEndIndex,
                    lineNum, colNum - 1 + 1);
}

// TODO add return for token struct
// TODO we're going to need a linkedlist for tokens
int tokenize(char str[])
{
    // TODO
    int tokens = malloc(1);

    unsigned int lineNum = 1;
    unsigned int colNum = 1;
    unsigned int currPartialTokenIndex = 0;

    char currPartialToken[MAX_TOKEN_SIZE] = "";

    const len = strlen(str);

    for (unsigned int i = 0; i < len; i++)
    {
        const currChar = str[i];

        switch (currChar)
        {
        // strings are null terminated so we treat that
        // as a newline to force all tokens out
        case '\0':
        case '\n':
            pushToken();
            pushCharToken(currChar);

            // update line and column nums
            lineNum++;
            colNum = 0;

            clearCurrPartialToken();
            break;
        case ' ':
        case '\t':
            pushToken();
            clearCurrPartialToken();
            break;
        CASE_NON_ALPHANUM:
            pushToken();
            pushCharToken(currChar);
            clearCurrPartialToken();

            break;
        CASE_ALPHANUM:
            currPartialToken[++currPartialTokenIndex] = currChar;
            break;
        default:
            error("Invalid char '%c' [%i:%i]", currChar, lineNum, colNum);
        }

        colNum++;
    }

    return tokens;
}

// lexer: uses context to assign meaning to tokens