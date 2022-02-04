//// MEMORY ////

const NULL = -100;
let memory = [];

// memory allocation and freeing
const malloc = (function () {
    let memoryPointer = 50;

    return function (size) {
        const allocatedPointer = memoryPointer;

        // clear memory b4 use
        for (let i = 0; i < size; i++) {
            memory[allocatedPointer + i] = null;
        }

        // bump pointer for internal use
        memoryPointer += size;

        return allocatedPointer;
    }
})();
const free = () => console.log("Warn: memory freeing not implemented");

// dereferencing / pointer indirection
const deref = (index, value) => {
    if (index <= 0 || index === null || index === NULL)
        throw new Error("Error: segmentation fault");

    // matches function signature <index>
    // no value supplied; we're dereferencing
    if (this.arguments.length === 1) return memory[index];

    // matches function signature <index> <value>
    // assuming dereferencing b/c no value supplied
    if (this.arguments.length === 2) return memory[index] = value;
}
const derefField = (baseIndex, fieldOffset, value) => {
    const index = baseIndex + fieldOffset;

    // make sure base pointer is good
    if (baseIndex <= 0 || baseIndex === null || baseIndex === NULL)
        throw new Error("Error: segmentation fault: invalid base index");

    // make sure offset brings to valid pointer
    if (index <= 0 || index === null || index === NULL)
        throw new Error("Error: segmentation fault: invalid offset");

    // hand off derefencing work to deref function
    return deref(index, value);
}

//// SKIP LIST ////
// temporarily set for debugging to prevent hangs
const EXECUTION_CAP = 100;

// define indices for fields of various structs for skipList
// the header for the skipList containing various metadata
const struct__skipListHeader = {
    length: 0,
    skipMultiplier: 1,
    headPtr: 2
};

// a single node in the skipList
const struct__skipListNode = {
    order: 0, // allows calculating maxSkips, skipAmount etc.
    value: 1,
    pointers: 2 // points to head of linked list of skip pointers
};

// linked list of pointers associated with each skipListNode
const struct__skipListPointers = {
    pointer: 0, // points to a skipListNode
    next: 1 // points to next node in pointer linked list
};

// returned from findOptimalSkip
const struct__skipListSkip = {
    node: 0, // the node this skip jumps to
    skipAmount: 1 // amount this skip jumps
};

const fn__skipList__findOptimalSkip = (pointers, skipMultiplier,
    maxSkipOrder, numSkipsAvailable, distFromDest) => {

    let prevSkipPtr = pointers;

    // go through each skip one by one until we find one that
    // brings us closer to destination without over-travelling
    for (let j = 0; j < numSkipsAvailable; j++) {
        const currSkipOrder = maxSkipOrder - j;
        const currSkipAmount = skipMultiplier ** currSkipOrder;

        const nextNodePtr = derefField(prevSkipPtr, struct__skipListPointers.pointer);
        const isFoundSkip = currSkipAmount <= distFromDest && nextNodePtr !== NULL;

        if (isFoundSkip) {
            const newSkip = malloc(2);

            derefField(newSkip, struct__skipListSkip.node, nextNodePtr);
            derefField(newSkip, struct__skipListSkip.skipAmount, currSkipAmount);

            return newSkip;
        }

        // TODO: 
        //   determine if this check can be placed outside
        //   of for loop for performance purposes
        // CONTEXT: 
        //   we reached the last iteration of loop, yet we still haven't
        //   found a valid link to targetIndex. this means node does not exist
        //   or the data structure is malformed
        if (currSkipOrder === 0) {
            console.warn(`Warn: no valid path to node at index ${index}`);
            console.warn(`Warn: node either does not exist or skipList is malformed.`);

            const newSkip = malloc(2);

            derefField(newSkip, struct__skipListSkip.node, NULL);
            derefField(newSkip, struct__skipListSkip.skipAmount, 0);

            return newSkip;
        }

        // go to next skipPtr
        prevSkipPtr = derefField(prevSkipPtr, struct__skipListPointers.next);
    }
}

const fn__skipList__getAtIndex = (skipListHeader, nodePtr, targetIndex) => {
    const skipMultiplier = derefField(skipListHeader, struct__skipListHeader.skipMultiplier);

    let currNodePtr = nodePtr;
    let i = 0, execCap = 0;

    while (currNodePtr !== NULL && execCap++ < EXECUTION_CAP) {
        if (i === targetIndex) return currNodePtr;

        const maxSkipOrder = derefField(currNodePtr, struct__skipListNode.order);
        const numSkipsAvailable = maxSkipOrder + 1;
        const distFromDest = index - i;
        const pointers = derefField(currNodePtr, struct__skipListNode.pointers);

        const optimalSkip = fn__skipList__findOptimalSkip(pointers, skipMultiplier,
            maxSkipOrder, numSkipsAvailable, distFromDest);

        // follow skip and update i accordingly
        currNodePtr = derefField(optimalSkip, struct__skipListSkip.node);
        i += derefField(optimalSkip, struct__skipListSkip.skipAmount);
    }

    // somehow we escaped the while loop without returning
    // this means we didn't find anything or reached execution cap
    console.warn(`Warn: node at index ${index} does not exist or execution cap exceeded`);
    return NULL;
}