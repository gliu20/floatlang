//// MEMORY ////

const NULL = -100;
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
    if (index === NULL || index === null || index <= 0)
        throw new Error("Error: segmentation fault");

    // no value supplied; we're dereferencing
    if (value === undefined) return memory[index];

    // value is supplied; we want to set a value
    memory[index] = value;
}


//// EXPONENTIAL SKIP LIST ////
const EXECUTION_CAP = 1000;

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
    30,             // 7 lvl3Ptr // node 4
    9,              // 8 nextPtr 
    18,             // 9 lvl2Ptr // node 2
    11,             // 10 nextPtr
    13,             // 11 lvl1Ptr // node 1
    NULL,           // 12 nextPtr

    //// node 1 ////
    0,              // 13 order
    "1st ele",      // 14 value
    16,             // 15 skipPointerListPtr

    //// ptr node 1 ////
    18,             // 16 lvl1Ptr // node 2
    NULL,           // 17 nextPtr

    //// node 2 ////
    1,              // 18 order
    "2nd ele",      // 19 value
    21,             // 20 skipPointerListPtr

    //// ptr node 2 ////
    30,             // 21 lvl2Ptr // node 4
    23,             // 22 nextPtr
    25,             // 23 lvl1Ptr // node 3
    NULL,           // 24 nextPtr

    //// node 3 ////
    0,              // 25 order
    "3rd ele",      // 26 value
    28,             // 27 skipPointerListPtr 

    //// ptr node 3 ////
    30,             // 28 lvl1Ptr // node 4
    NULL,           // 29 nextPtr

    //// node 4 ////
    0,              // 30 order
    "4th ele",      // 31 value
    33,             // 32 skipPointerListPtr

    //// ptr node 4 ////
    NULL,           // 33 lvl1Ptr // TAIL ptr
    NULL,           // 34 nextPtr

    null,           // 35
    null,           // 36
    null,           // 37
    null,           // 38
    null,           // 39

    //// node new 3 ////
    0,              // 40 order
    "b/w 3/4 ele",  // 41 value
    43,             // 42 skipPointerListPtr

    //// ptr node new 3 ////
    NULL,           // 43 lvl1Ptr // TAIL ptr
    NULL,           // 44 nextPtr

];

memory = testSkipList;

// returns pointer to first node in skipList
const getHead = (skipListHeader) => {
    const headPtr = deref(skipListHeader + 2);

    return headPtr;
}

/*
// TODO remake this for new format
const createNode = (length) => {
    const nodePtr = malloc(length);

    deref(nodePtr, length); // set size of node
    deref(nodePtr + 1, null); // set initial value of node to null
}*/

// returns pointer to skipListNode
const getAtIndex = (headPtr, index, skipMultiplier) => {

    let currNodePtr = headPtr;

    for (let i = 0, execCap = 0; currNodePtr !== NULL && execCap++ < EXECUTION_CAP;) {

        if (index === i) return currNodePtr;

        const maxSkipOrder = deref(currNodePtr);
        const numSkipsAvailable = maxSkipOrder + 1;
        const value = deref(currNodePtr + 1);
        const distFromDest = index - i;

        //console.log(`Debug: getAtIndex: looking at '${value}' at i: ${i} w/ dist: ${distFromDest}`);

        let skipPtrListPtr = deref(currNodePtr + 2);
        let prevSkipPtr = skipPtrListPtr;

        for (let j = 0; j < numSkipsAvailable; j++) {
            // calculate skip that goes the furthest from a node
            // while still reaching destination
            const skipOrder = maxSkipOrder - j;
            const skipAmount = skipMultiplier ** skipOrder;

            const nextNodePtr = deref(prevSkipPtr);

            //console.log(`Info: Trying skipAmount ${skipAmount}`)

            if (skipAmount <= distFromDest &&
                nextNodePtr !== NULL) {
                //console.log(`Debug: getAtIndex: Skipping ${skipAmount} units forward`)

                currNodePtr = nextNodePtr;
                i += skipAmount;

                // once you skip, the ptrs of currNode
                // no longer apply
                break;
            }

            // we should have breaked if index exists
            // therefore node does exist or the data structure
            // is malformed
            if (skipOrder === 0) {
                console.error(`Error: No valid path to node at index ${index}`)
                console.error("Error: Node either does not exist or the list is malformed")
                return NULL;
            }

            // move to next skipPtr
            prevSkipPtr = deref(prevSkipPtr + 1);
        }


    }

    console.log(`Warn: Node at index ${index} does not exist`)

    return NULL;
}

const insertAfterIndex = (skipListHeader, index, node) => {
    const length = deref(skipListHeader);
    const skipMultiplier = deref(skipListHeader + 1);

    const lengthAfterInsert = length + 1;
    const depthAfterInsert = Math.floor(Math.log(lengthAfterInsert) / Math.log(skipMultiplier));

    const headPtr = getHead(skipListHeader);
    const indexNodePtr = getAtIndex(headPtr, index, skipMultiplier);


    const desiredSkipOrder = lengthAfterInsert - (index + 1);

    let nodeSkipOrder = deref(node);
    let skipPointerListPtr = deref(node + 2);
    let currNodePtr = skipPointerListPtr;

    // okay this should guarantee correct
    // order of node
    while (desiredSkipOrder !== (nodeSkipOrder = deref(node))) {
        if (desiredSkipOrder > nodeSkipOrder) {
            const newPtrNode = malloc(2);

            deref(newPtrNode + 1, skipPointerListPtr);  // newPtrNode->next = skipPointerListPtr;
            deref(node + 2, newPtrNode);                // node->skipPointerListPtr = newPtrNode;

            skipPointerListPtr = newPtrNode;

            // increment order of node
            deref(node, nodeSkipOrder + 1);

            // set currNodePtr
            currNodePtr = newPtrNode;
        }

        if (desiredSkipOrder > 0 &&
            desiredSkipOrder < nodeSkipOrder) {
                // skipPointerListPtr = currNodePtr->next;
                skipPointerListPtr = deref(currNodePtr + 1)

                if (skipPointerListPtr === NULL)
                    throw new Error("Error: found NULL when lowering order of node")

                // remove currNodePtr
                free(currNodePtr);

                // decrement order of node
                deref(node, nodeSkipOrder + 1);

        }
    }

    // first update size of list based on skipOrder
    // then update pointers
    // special case for order 0 / 1
    for (let i = desiredSkipOrder; i >= 0; i--) {
        const desiredSkipAmount = skipMultiplier ** i;


        // newPtrNode->value = ele that is desired skip ele away from node to be added;
        deref(newPtrNode, getAtIndex(indexNodePtr, desiredSkipAmount + 1, skipMultiplier));

        currNodePtr = deref(currNodePtr + 1) // currNodePtr = currNodePtr->next
    }

    let prevNodePtr = headPtr;
    let prevNodeOffset = 0;

    for (let i = depthAfterInsert; i >= 0; i--) {
        const skipAmount = skipMultiplier ** i;
        const backwardsOffset = index % skipAmount;
        const backwardsIndex = index - backwardsOffset;


        prevNodePtr = getAtIndex(prevNodePtr, backwardsIndex - prevNodeOffset, skipMultiplier);

        console.log(`Debug: insertAfterIndex: Analyzing level ${skipAmount}. At node '${deref(prevNodePtr + 1)}`);
        console.log(`Debug: insertAfterIndex: Accessing node at ${backwardsIndex}`)

        prevNodeOffset += backwardsIndex;

        // now we have to update pointers on prev node
        // skip order is i and that is the level of the
        // pointer we have to update
        const nodeSkipOrder = deref(prevNodePtr);
        const desiredSkipOrder = i;
        const desiredSkipAmount = skipMultiplier ** desiredSkipOrder;

        let skipPointerListPtr = deref(prevNodePtr + 2);

        // this node needs to add a higher level instead of modifying pointers
        if (nodeSkipOrder < desiredSkipOrder) {
            if (desiredSkipOrder - nodeSkipOrder !== 1) {
                console.log(`Error: desiredSkipOrder - nodeSkipOrder !== 1. Instead got ${desiredSkipOrder - nodeSkipOrder}`);
                return false;
            }
            const newPtrNode = malloc(2);

            deref(newPtrNode, NULL);                   // newPtrNode->value = NULL;
            deref(newPtrNode + 1, skipPointerListPtr); // newPtrNode->next = skipPointerListPtr;
            deref(prevNodePtr + 2, newPtrNode);        // prevNodePtr->skipPointerListPtr = newPtrNode;

            skipPointerListPtr = newPtrNode;

            // increment order
            deref(prevNodePtr, nodeSkipOrder + 1);
        }

        let candidatePtr = skipPointerListPtr;

        // descend down skipPointerListPtr to pointer of desiredSkipOrder
        for (let i = 0; i < nodeSkipOrder - desiredSkipOrder; i++) {
            candidatePtr = deref(candidatePtr + 1);
        }

        // candidatePtr is calculated.. now need to update ptr to correct location
        const newCandidateLocation = getAtIndex(prevNodePtr, desiredSkipAmount - 1, skipMultiplier);

        if (newCandidateLocation === indexNodePtr) {
            deref(candidatePtr, node);
        }
        else {
            deref(candidatePtr, newCandidateLocation);
        }
    }

    // update length after insert operation
    deref(skipListHeader, lengthAfterInsert);

    // success code
    return true;
}