PROG = prog
PROG_DEBUG = prog_debug
CC = gcc
SRCS = $(wildcard *.c)
OBJS = $(SRCS:.c=.o)
CFLAGS = -Wall -O0 -Werror
LDFLAGS = -lm
DEBUGFLAGS = -fsanitize=address,undefined -g

.PHONY: all
all: $(PROG) $(PROG_DEBUG)

.SUFFIXES: .o .c
.c.o:
	$(CC) $(CFLAGS) -c $<

$(PROG): $(OBJS)
	$(CC) -g -o $@ $^ $(LDFLAGS)

$(PROG_DEBUG): $(OBJS)
	$(CC) -o $@ $^ $(LDFLAGS) $(DEBUGFLAGS)

.PHONY: clean
clean: 
	rm -f $(PROG) $(PROG_DEBUG) $(OBJS)

