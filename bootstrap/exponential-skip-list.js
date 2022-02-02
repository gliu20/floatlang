//// MEMORY ////

const NULL = 0;
const memory = [];

// bump allocator
const malloc = (function () {
    let memoryPointer = 1;

    return function (size) {
        // clear memory before use
        for (let i = 0; i < size; i++) {
            memory[memoryPointer + i] = null;
        }
        
        return memoryPointer += size;
    }
})();

const free = (function () {
    console.log("Warn: Memory freeing is not implemented")
})

const deref = (index) => {
    if (index === NULL)
        throw new Error ("Error: segmentation fault");
    return memory[index];
}


//// EXPONENTIAL SKIP LIST ////

const SKIP_MULTIPLIER = 2;

/*
// This is how the struct
// will be implemented in "memory"

struct skipListHeader = {
    length: 0,
    headPtr: NULL
};

struct skipListNode = {
    length: 0, // size of node
    value: null,
    nextPtrLvl1: NULL,
    nextPtrLvl2: NULL,
    ...
    nextPtrLvln: NULL
}
*/

// returns pointer to skipListNode
const getAtIndex = (skipListHeader, index) => {
    const length = deref(skipListHeader);
    const headPtr = deref(skipListHeader + 1);

    let currPtr = headPtr;
    for (let i = 0; i < length;) {
        if (currPtr === NULL) {
            return NULL;
        }
        
        const nodeLength = deref(currPtr);
        const value = deref(currPtr + 1);
        const distFromDest = index - i;

        console.log(`Info: looking at ${value} at i: ${i}`);

        for (let j = 0; j < nodeLength - 2; j++) {
            const nodeFieldIndex = nodeLength - 1 - j;
            const skipOrder = nodeLength - 2 - j - 1;
            const skipAmount = 2 ** skipOrder;
            const nextPtr = deref(currPtr + nodeFieldIndex);

            if (skipAmount <= distFromDest &&
                nextPtr !== NULL) {
                    currPtr = nextPtr;
                    i += skipAmount;
            }

            if (index === i) return currPtr;
        }
    }
}