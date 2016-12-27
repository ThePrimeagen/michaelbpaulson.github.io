---
layout: post
title: My Journy into Go
category: go
permalink: /go/intro
---

### Go Nuts
It is time for me to continue to grow as a developer.  I have become so
familiar with JavaScript and Node that is just time to learn something new.  So
I decided that I would learn Go.

I am a complete rookie and the following blog-posts are likely to contain some
errors as I learn.  If I learn that I have given misinformation I will correct
the post and probably do a follow-up post about it.

### Getting started
After reading through the internet I have seen a couple resources come up over
and over again, [The Tour of Go](https://tour.golang.org/welcome/1) and
[Effective Go](https://golang.org/doc/effective_go.html).  Anyone who is
serious about learning Go, these are the best single papers / exercises to read
/ perform.  Afterwords, you should be able to get started writing Go.

### First Impressions
#### Syntax
The language is a bit strange at first.  No semi-colons or parenthesis.  But
after only a small time the removal of these seems fine to me.  I thought I
would have had a harder time getting use to that, but it was rather easy
transitions.  On the other hand one of my favorite language requirements have
been made in Go, required opening and closing squirly braces (`{ ... }`) on
every `if`, `for`, `switch`, `func` statements.  This is just great!

Go is a strong type language but contains sugar to make it easier.  One of my big gripes about strong types languages is the boiler-plate around declaring types.  In Go there is a convenient operator `:=` which will imply the type for you.


{% highlight go %}
// Proper way to declare a variable.
var myInt int = 0

// Implicit way of declaring the same variable
myInt := 0

{% endhighlight %}

Another great feature of Go is multiple return values.  I am so use to javascript having to create an obtuse tuple or an object.  Both of which stink when attempting to return multiple values.  In Go that is not a problem.

{% highlight go %}

package main

import "fmt"

func swap(a, b int) (int, int) {
    return b, a
}

func main() {
    a, b := 5, 3
    a, b = swap(a, b)

    fmt.Printf("Look at this!! %v %v", a, b)
}

{% endhighlight %}

#### Modules and Packages
Wow.  This was a confusing part of Go at first, especially when coming from javascript.  But now, I really like it, though I have very low experience so I may change my mind in the future.  I have not found a good resource for this, so this topic will probably be my next post (to be fair, I have not tried hard to search for one).

#### Concurrancy
I am so use to the callback style of javascript (I am lumping in Promises and Rx into this style).  It seems like a very natural way of async programming.  In Go you can use callbacks, but there are other means.  There is also a `defer` operator which is amazing for clean-up tasks.  I would strongly suggest going over the Tour of Go exercises when it comes to concurrancy.

### My First Exercise
To fully prove out my new set of skills aquired from Tour Go and Effective Go I am going to make a framing protocol on top of TCP.  It is going to be a simple protocol.

{% highlight javascript %}

// First four bytes is LittleEndian uint length of data packet.
// The remaining bytes (4 through length + 4) is the data itself
[0 .. 3: Message Length][4 .. Message Length + 4:  Data]

{% endhighlight %}

My goals of this project are:

* Experiment with Go packages
* Learn Go API
* Understand `go` routines and `channels`
* Not use callbacks
* Use Go

I think this should be quite fun.

