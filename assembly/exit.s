# PURPOSE:
#   basically hello world to exit
#   to check exit code, run echo $? after execution

# INPUT: none
#   OUTPUT: exit status code

# REGISTERS:
#   %eax is the syscall num
#   %ebx is the return status

.section .data
.section .text
.globl _start

_start:
    movl $1, %eax        # linux syscall for exit
    movl $0, %ebx       # exit code
    int $0x80


# types
# .byte 0 to 255
# .int 0 and 65545 (two bytes)
# .long 0 and 4294967295 (4 bytes) (size of register)
# .ascii

# indexed addressing mode
# beginning_address(,$index_register,word_size)


# ADDRESS_OR_OFFSET(%BASE_OR_OFFSET,%INDEX,MULTIPLIER)
# FINAL ADDRESS = ADDRESS_OR_OFFSET + %BASE_OR_OFFSET + MULTIPLIER * %INDEX

