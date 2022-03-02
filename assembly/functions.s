# PURPOSE:
#   work out C calling convention function prologues and
#   epilogues for the compiler to automatically add in


# CALLING A FUNCTION
# push params of callee in reverse order
# execute `call function_name`
#   call pushes address of next instruciton onto stack
#   and sets instruction point to start of callee
.section .text

.globl _start
.globl my_function

_start:
    # before calling, stack pointer %RSP must be 16 byte aligned
    call my_function


# reference: https://cs.lmu.edu/~ray/notes/gasexamples/
my_function: 
    # CALLEE PROLOGUE
    pushq %rbp          # saves old base pointer which can be anything;
                        # it might be something that a function was previously
                        # using so we have to save it
    movq %rsp, %rbp     # copies stack pointer to base pointer

    # now base pointer to top of stack
    # underneath the stack is all of the params
    # and the return address of the caller


    # CALLEE BODY
    # reserve space for local variables
    subq $8, %rsp       # don't have to worry about pushes and pops
                        # remember that the stack grows from the bottom
                        # (where memory addresses are highest)

    # now stack pointer shouldn't interfere with our variables
    # base pointer is left as it was before


    # CALLEE EPILOGUE
    # when CALLEE function is done, store result in %eax
    movq %rbp, %rsp     # recovers stack pointer to original value
                        # thus de allocating everything in current stack frame
    popq %rbp           # restore caller's base pointer if they used it
    ret                 # return control back to caller
