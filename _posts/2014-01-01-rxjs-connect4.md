---
layout: post
title: Building Connect4 with RxJS
categories: rx
date: 2014-01-01 10:35:01
image: rxjs-connect4.png
---

RxJS - Connect4
---------------

{% include rxjs/connect4/game.html %}

### Rx
RxJS is a library to aid in reactive functional programming.  To learn more about Rx and functional programming checkout this blog post.

* [Learn RX](http://reactive-extensions.github.io/learnrx)
* [Netflix Rx Marble Diagrams](http://netflix.github.io/RxJava/javadoc/rx/Observable.html)

i would recommend reading before proceeding.

### Program Flow

There are 5 observables used in this program.  The first is the data observable.  It drives the whole program.  The data observable
consists of listening to the left and right of the keyboard and the enter key.  From this, it generates the current world state.

{% highlight javascript %}
// basic code example (no actual code was hurt in the making)
function gameLoop() {
    // The graph is the board.  Every node has 4 neighbors.  The edge nodes neighbors are just self references
    var graph = Graph({rows: 11, columns: 15});

    // Returns 2 observables in an array [enterActionObservable, directionActionObservable]
    var keyboardObs = [enterObs, dirObs];
    var gameObservable = Rx.Observable.merge(keyboardObs);

    // isThereWinner: Its inefficient.  just deal with it.  I know i could test only the newly selected node.
    var gameHasBeenWonObs = GameLogic.isThereWinner(graph, gameObservable[0]);

    // When game has been won, play animation then restart.
    gameHasBeenWonObs.subscribe(function(winningNodes) {
        playAnimations().subscribe(NOOP, NOOP, function() {
            gameLoop();
        });
    });

    // Subscribe to gameObservable and take until winner
    Rx.Observable.merge(gameObservable)
        .takeUntil(gameHasBeenWonObs)O
        .subscribe();
}
{% endhighlight %}
---

Actual source code [here](https://github.com/primeagen/rxjs-connect4)

### Notes
The above code is very pseudo.  The actual code is slightly more complex :)

### Furthur Work
I am going to try rewriting the program with a different async library.

[JS/Pipe](http://jspipe.org/)
