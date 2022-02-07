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
    if (value === undefined) return memory[index];

    // matches function signature <index> <value>
    // assuming dereferencing b/c no value supplied
    return memory[index] = value;
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


//// LINKED LIST ////
// a single node in linked list
const struct__linkedListNode = {
    value: 0,
    next: 1
};

const struct__linkedListBookends = {
    headPtr: 0,
    tailPtr: 1
};

const fn__linkedList__insertAtTail = (currBookends, nodePtr) => {

    const currHeadPtr = derefField(currBookends, struct__linkedListBookends.headPtr);
    const currTailPtr = derefField(currBookends, struct__linkedListBookends.tailPtr);

    const newBookends = malloc(2);

    // nodePtr is the new tail so make nodePtr point to NULL and
    // set tailPtr to nodePtr 
    derefField(nodePtr, struct__linkedListNode.next, NULL);
    derefField(newBookends, struct__linkedListBookends.tailPtr, nodePtr);

    if (currTailPtr === NULL) {
        // tail does not exist so the head is nodePtr
        derefField(newBookends, struct__linkedListBookends.headPtr, nodePtr);

        return newBookends;
    }

    // make current tail point to nodePtr which is the new tail
    derefField(currTailPtr, struct__linkedListNode.next, nodePtr);

    // head is unchanged so we keep it as is
    derefField(newBookends, struct__linkedListBookends.headPtr, currHeadPtr);

    return newBookends;
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
    maxSkipOrder, numSkipsAvailable, distFromDest, targetIndex) => {

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
            console.warn(`Warn: no valid path to node at index ${targetIndex}`);
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
        const distFromDest = targetIndex - i;
        const pointers = derefField(currNodePtr, struct__skipListNode.pointers);

        const optimalSkip = fn__skipList__findOptimalSkip(pointers, skipMultiplier,
            maxSkipOrder, numSkipsAvailable, distFromDest, targetIndex);

        // follow skip and update i accordingly
        currNodePtr = derefField(optimalSkip, struct__skipListSkip.node);
        i += derefField(optimalSkip, struct__skipListSkip.skipAmount);
    }

    // somehow we escaped the while loop without returning
    // this means we didn't find anything or reached execution cap
    console.warn(`Warn: node at index ${targetIndex} does not exist or execution cap exceeded`);
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

    // this is the linked list header definition
    // we will chop off the header when we store it as part of the
    // backrefs struct
    let bookends = malloc(2);
    let order = 0;

    derefField(bookends, struct__linkedListBookends.headPtr, NULL);
    derefField(bookends, struct__linkedListBookends.tailPtr, NULL);

    // we start with the biggest skips because those start earlier
    // in a skip pointer list but, more importantly, they allow us to
    // cache the prevNodePtr and continue searches from this pointer
    // stopping us from needing to traverse the entire skipList.
    //
    // what we do is find item with skipAmount that points to our
    // desired element

    for (let i = depthAfterInsert; i >= 0; i--) {
        // backwards index is the absolute memory address of the node we want
        // we also adjust to make sure it is non-negative
        const skipAmount = skipMultiplier ** i;
        const backwardsOffset = (targetIndex - 1) % skipAmount;
        const backwardsIndex = Math.max((targetIndex - 1) - backwardsOffset, 0);

        // because we run getIndex starting at prevNodePtr, indices
        // have to be converted to be relative to prevNodePtr
        // instead of as an absolute memory address
        const adjustedIndex = backwardsIndex - prevNodeOffset;

        if (adjustedIndex < 0) throw new Error("Error: expected adjustedIndex to be non-negative");

        const nextNodePtr = fn__skipList__getAtIndex(skipListHeader, prevNodePtr, adjustedIndex);
        
        // TODO: consider for performance improvements
        // CONTEXT:
        //   nextNodePtr should have a skipPointer at depth i
        //   and that's the pointer that points to the targetIndex
        //   this is the one that should be updated, but we're not doing
        //   this update in this function; however, it might be considered
        //   to do something here for performance

        // add node to skipPointerList
        const newNode = malloc(2);

        derefField(newNode, struct__skipListPointers.pointer, nextNodePtr);
        derefField(newNode, struct__skipListPointers.next, NULL);

        bookends = fn__linkedList__insertAtTail(bookends, newNode);
        order++;

        // update for next iteration
        prevNodePtr = nextNodePtr;
        prevNodeOffset += backwardsIndex;
    }

    // now we have to create the backrefs struct
    const skipPointerListHead = derefField(bookends, struct__linkedListBookends.headPtr);
    const backrefs = malloc(2);

    derefField(backrefs, struct__skipListBackrefs.order, order);
    derefField(backrefs, struct__skipListBackrefs.pointers, skipPointerListHead);

    return backrefs;

}


function debugPrintSL(skipListBackrefs, msg) {
    const order = derefField(skipListBackrefs, struct__skipListBackrefs.order);
    let output = `Info: ${msg || ""}LinkedList(${order}): `;

    let currNodePtr = derefField(skipListBackrefs, struct__skipListBackrefs.pointers);
    while (currNodePtr !== NULL) {
        const currNode = derefField(currNodePtr, struct__skipListPointers.pointer);

        output += `${derefField(currNode, struct__skipListNode.value)} --> `;

        // move on to next pointer
        currNodePtr = derefField(currNodePtr, struct__skipListPointers.next);
    }
    output += "NULL";
    console.log(output);
}

function debugPrintLL(headPtr, msg) {
    let output = `Info: ${msg || ""}LinkedList: `;

    let currNodePtr = headPtr;
    while (currNodePtr !== NULL) {
        const value = derefField(currNodePtr, struct__linkedListNode.value);

        output += `${value} --> `;
        currNodePtr = derefField(currNodePtr, struct__linkedListNode.next);
    }
    output += "NULL";
    console.log(output);
}

function testLL() {
    let bookends = malloc(2);

    derefField(bookends, struct__linkedListBookends.headPtr, NULL);
    derefField(bookends, struct__linkedListBookends.tailPtr, NULL);

    for (let i = 10; i >= 0; i--) {
        const newNode = malloc(2);

        derefField(newNode, struct__linkedListNode.value, `${i}th ele`);
        derefField(newNode, struct__linkedListNode.next, NULL);

        bookends = fn__linkedList__insertAtTail(bookends, newNode);

        debugPrintLL(derefField(bookends, struct__linkedListBookends.headPtr));
    }
}

