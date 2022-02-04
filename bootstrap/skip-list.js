//// MEMORY ////

const NULL = -100;
let memory = [];


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

// linked list of forward pointers associated with each skipListNode
// alternatively, can be a linked list of backward pointers
const struct__skipListPointers = {
    pointer: 0, // points to a skipListNode
    next: 1 // points to next node in pointer linked list
};

// returned from findOptimalSkip
const struct__skipListSkip = {
    node: 0, // the node this skip jumps to
    skipAmount: 1 // amount this skip jumps
};

// returned from findBackrefsAtIndex
const struct__skipListBackrefs = {
    order: 0, // allows calculating maxSkips, skipAmount etc.
    pointers: 1 // points to head of linked list of skip pointers
}

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

const fn__skipList__findBackrefsAtIndex = (skipListHeader, targetIndex) => {
    
    const headPtr = derefField(skipListHeader, struct__skipListHeader.headPtr);
    const length = derefField(skipListHeader, struct__skipListHeader.length);
    const skipMultiplier = derefField(skipListHeader, struct__skipListHeader.skipMultiplier);

    const lengthAfterInsert = length + 1;
    const depthAfterInsert = Math.floor(Math.log(lengthAfterInsert) / Math.log(skipMultiplier));

    // go through each depth and calculate the node right before targetIndex
    // this is optimized b/c we cache each prevNodePtr and continue searches
    // for lower depths from this pointer
    let prevNodePtr = headPtr;
    let prevNodeOffset = 0;

    // TODO: figure out easy way to remove this unnecessary
    // memory allocation that is unused
    let backrefsTail = malloc(2);

    // initialize empty tail
    // because we insert at tail, this will become the head of the list
    derefField(backrefsTail, struct__skipListPointers.pointer, NULL);
    derefField(backrefsTail, struct__skipListPointers.next, NULL);
    
    const newBackrefs = malloc(2);

    // initialize backrefsList 
    derefField(newBackrefs, struct__skipListBackrefs.order, 0);
    derefField(newBackrefs, struct__skipListBackrefs.pointers, NULL);

    for (let i = depthAfterInsert; i >= 0; i--) {
        
        // backwards index is the absolute memory address of the node we want
        const skipAmount = skipMultiplier ** i;
        const backwardsOffset = targetIndex % skipAmount;
        const backwardsIndex = targetIndex - backwardsOffset;

        // because we run getIndex starting at prevNodePtr, indices
        // have to be converted to be relative to prevNodePtr
        // instead of as an absolute memory address
        const adjustedIndex = backwardsIndex - prevNodeOffset;
        const currNodePtr = fn__skipList__getAtIndex(skipListHeader, prevNodePtr, adjustedIndex);
        
        // update for next iteration
        prevNodePtr = currNodePtr;
        prevNodeOffset += backwardsIndex;

        // TODO: refactor insert at end of linked list logic to its own function
        // add currNodePtr to the tail of the pointers linked list
        // so that higher level skips are at the top
        const newPointerNode = malloc(2);

        // link newPointerNode to end of list
        derefField(newPointerNode, struct__skipListPointers.pointer, currNodePtr);
        derefField(newPointerNode, struct__skipListPointers.next, NULL);

        // have tail of linked list point to newPointerNode
        derefField(backrefsTail, struct__skipListPointers.next, newPointerNode);
        
        // tail is now newPointerNode
        backrefsTail = newPointerNode;     
        
        // update skipOrder of newBackrefs
        const prevSkipOrder = derefField(newBackrefs, struct__skipListBackrefs.order);
        derefField(newBackrefs, struct__skipListBackrefs.order, prevSkipOrder + 1);
    }

    // we have made a dummy head for ease of coding
    // but now we have to remove it
    const dummyHead = derefField(newBackrefs, struct__skipListBackrefs.pointers);
    const realHead = derefField(dummyHead, struct__skipListPointers.next);

    // point to real head
    derefField(newBackrefs, struct__skipListBackrefs.pointers, realHead);

    return newBackrefs;
}