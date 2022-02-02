//// MEMORY ////

const NULL = 0;
let memory = [];

// bump allocator
const malloc = (function () {
    let memoryPointer = 50;

    return function (size) {
        const allocatedPointer = memoryPointer;

        // clear memory before use
        for (let i = 0; i < size; i++) {
            memory[memoryPointer + i] = null;
        }

        // bump pointer for internal use
        memoryPointer += size;
        
        return allocatedPointer;
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
    order: 0, // allows calculating maxSkip etc.
    value: null,
    skipPointerListPtr: NULL
};

// basically a linked list
struct skipListPointerListNode = {
    skipPointerListPtr: NULL,
    next: NULL,
};


*/

const testSkipList = [
    //// list header ////
    null,           // 0 segmentation fault 
    5,              // 1 length of list
    2,              // 2 skip multiplier
    4,              // 3 HEAD ptr

    //// node 0 ////
    2,              // 4 order
    "0th ele",      // 5 value
    7,              // 6 skipPointerListPtr

    //// ptr node 0 ////
    "4th ptr",      // 7 lvl3Ptr // node 4
    9,              // 8 nextPtr 
    "2nd ptr",      // 9 lvl2Ptr // node 2
    11,             // 10 nextPtr
    "1st ptr",      // 11 lvl1Ptr // node 1
    NULL,           // 12 nextPtr

    //// node 1 ////
    0,              // 13 order
    "1st ele",      // 14 value
    16,             // 15 skipPointerListPtr

    //// ptr node 1 ////
    "2nd ptr",      // 16 lvl1Ptr // node 2
    NULL,           // 17 nextPtr

    //// node 2 ////
    1,              // 18 order
    "2nd ele",      // 19 value
    21,             // 20 skipPointerListPtr

    //// ptr node 2 ////
    "3rd ptr",      // 21 lvl1Ptr // node 3
    23,             // 22 nextPtr
    "4th ptr",      // 23 lvl2Ptr // node 4
    NULL,           // 24 nextPtr

    //// node 3 ////
    0,              // 25 order
    "3rd ele",      // 26 value
    28,             // 27 skipPointerListPtr 

    //// ptr node 3 ////
    "4th ptr",      // 28 lvl1Ptr // node 4
    NULL,           // 29 nextPtr

    //// node 4 ////
    0,              // 30 order
    "4th ele",      // 31 value
    33,             // 32 skipPointerListPtr

    //// ptr node 4 ////
    NULL,           // 33 lvl1Ptr // TAIL ptr
    NULL,           // 34 nextPtr
];

memory = testSkipList;

// returns pointer to first node in skipList
const getHead = (skipListHeader) => {
    const headPtr = deref(skipListHeader + 1);

    return headPtr;
}

const createNode = (length) => {
    const nodePtr = malloc(length);

    deref(nodePtr, length); // set size of node
    deref(nodePtr + 1, null); // set initial value of node to null
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
    
    const headPtr = getHead(skipListHeader);
    let prevNodePtr = headPtr;

    for (let i = depthAfterInsert - 1; i < 0; i--) {
        const skipAmount = SKIP_MULTIPLIER ** i;
        const backwardsOffset = index % skipAmount;
        const backwardsIndex = index - backwardsOffset;

        console.log(`Info: Analyzing level ${skipAmount}. Going backwards ${backwardsOffset} units`);
        console.log(`Info: Currently at ${index} and going to ${backwardsIndex}`)
        
        prevNodePtr = getAtIndex(prevNodePtr, backwardsIndex);

        // now we have to update pointers on prev node
        // skip order is i and that is the level of the
        // pointer we have to update
        const nodeLength = deref(prevNodePtr);
        const desiredNodeLength = i + 2 + 1;

        // this node is too small so we have to allocate a 
        // new larger node and create pointers for it
        if (nodeLength < desiredNodeLength) {
            const newNodePtr = createNode(desiredNodeLength);
            
            for (let i = 1; i < nodeLength; i++) {
                // copy each field from prevNode to newNodePtr
                deref(newNodePtr + i, deref(prevNodePtr + i))
            }

            // free old node that we no longer need
            free(prevNodePtr);
    
            // set prevNodePtr to something else
            prevNodePtr = null;

            // PROBLEM:
            // now all ptrs to prevNode have to be rewritten
            // increasing time complexity
            // SOLUTION:
            // re-architect skipPointers as a linkedList
        }

    }

    // update length after insert operation
    deref(skipListHeader, lengthAfterInsert);

}