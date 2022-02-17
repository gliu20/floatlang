#pragma once;


struct linkedlist_head {
    struct linkedlist_node *head;
    struct linkedlist_node *tail;
};

struct linkedlist_node {
    struct linkedlist_node *next;
};