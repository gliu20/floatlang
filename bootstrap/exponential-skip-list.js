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

const deref = (index, value) => {
    if (index === NULL || index === null)
        throw new Error ("Error: segmentation fault");

    // no value supplied; we're dereferencing
    if (value === undefined) return memory[index];

    // value is supplied; we want to set a value
    memory[index] = value;
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
    11,             // 6 Lvl2Ptr // node 2
    18,             // 7 Lvl3Ptr // node 4

    //// node 1 ////
    3,              // 8 size
    "1st ele",      // 9 value
    11,             // 10 lvl1Ptr // node 2

    //// node 2 ////
    4,              // 11 size
    "2nd ele",      // 12 value
    15,             // 13 lvl1Ptr // node 3
    18,             // 14 lvl2Ptr // node 4

    //// node 3 ////
    3,              // 15 size
    "3rd ele",      // 16 value
    18,             // 17 lvl1Ptr // node 4

    //// node 4 ////
    3,              // 18 size
    "4th ele",      // 19 value
    NULL,           // 20 lvl1Ptr // TAIL ptr
];

memory = testSkipList;

// returns pointer to first node in skipList
const getHead = (skipListHeader) => {
    const headPtr = deref(skipListHeader + 1);

    return headPtr;
}

// returns pointer to skipListNode
const getAtIndex = (headPtr, index) => {

    let currPtr = headPtr;
    while (currPtr !== NULL) {
        
        const nodeLength = deref(currPtr);
        const value = deref(currPtr + 1);
        const distFromDest = index - i;

        console.log(`Info: looking at '${value}' at i: ${i} w/ dist: ${distFromDest}`);

        for (let j = 0; j < nodeLength - 2; j++) {
            // calculate skip that goes the furthest from a node
            // while still reaching destination
            const nodeFieldIndex = nodeLength - 1 - j;
            const skipOrder = nodeLength - 2 - j - 1;
            const skipAmount = SKIP_MULTIPLIER ** skipOrder;
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

const insertAfterIndex = (skipListHeader, index, node) => {
    const length = deref(skipListHeader);
    const lengthAfterInsert = length + 1;
    const depthAfterInsert = Math.floor(Math.log(lengthAfterInsert) / Math.log(SKIP_MULTIPLIER));
    
    let prevNodePtr = NULL;

    for (let i = depthAfterInsert - 1; i < 0; i--) {
        const skipAmount = SKIP_MULTIPLIER ** i;
        const backwardsOffset = index % skipAmount;
        const backwardsIndex = index - backwardsOffset;

        console.log(`Info: Analyzing level ${skipAmount}. Going backwards ${backwardsOffset} units`);
        console.log(`Info: Currently at ${index} and going to ${backwardsIndex}`)
        
        prevNodePtr = getAtIndex(skipListHeader, backwardsIndex);

        // now we have to update pointers on prev node
        // skip order is i and that is the level of the
        // pointer we have to update

    }

    // update length after insert operation
    deref(skipListHeader, lengthAfterInsert);

}