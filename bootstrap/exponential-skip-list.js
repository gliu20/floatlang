//// MEMORY ////

const NULL = 0;
let memory = [];

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
    if (index === NULL || index === null)
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

const testSkipList = [
    //// list header ////
    null,           // 0 segmentation fault 
    5,              // 1 length of list
    3,              // 2 HEAD ptr

    //// node 0 ////
    5,              // 3 size
    "0th ele",      // 4 value
    8,              // 5 lvl1Ptr // node 1
    12,             // 6 Lvl2Ptr // node 2
    19,             // 7 Lvl3Ptr // node 4

    //// node 1 ////
    4,              // 8 size
    "1st ele",      // 9 value
    12,             // 10 lvl1Ptr // node 2
    16,             // 11 lvl2Ptr // node 3

    //// node 2 ////
    4,              // 12 size
    "2nd ele",      // 13 value
    16,             // 14 lvl1Ptr // node 3
    19,             // 15 lvl2Ptr // node 4

    //// node 3 ////
    3,              // 16 size
    "3rd ele",      // 17 value
    19,             // 18 lvl1Ptr // node 4

    //// node 4 ////
    3,              // 19 size
    "4th ele",      // 20 value
    NULL,           // 21 lvl1Ptr // TAIL ptr
];

memory = testSkipList;

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

        console.log(`Info: looking at '${value}' at i: ${i} w/ dist: ${distFromDest}`);

        for (let j = 0; j < nodeLength - 2; j++) {
            const nodeFieldIndex = nodeLength - 1 - j;
            const skipOrder = nodeLength - 2 - j - 1;
            const skipAmount = 2 ** skipOrder;
            const nextPtr = deref(currPtr + nodeFieldIndex);

            if (skipAmount <= distFromDest &&
                nextPtr !== NULL) {
                    console.log(`Info: Skipping ${skipAmount} units forward`)
                    currPtr = nextPtr;
                    i += skipAmount;
            }

            if (index === i) return currPtr;
        }
    }

    return NULL;
}