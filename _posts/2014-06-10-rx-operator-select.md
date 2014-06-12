---
layout: post
title: Select - RxJS
categories: rx,rxoperators
date: 2014-06-10 10:35:01
image: rx128.png
---

### Understanding Select

`select` is one of the most used operators in Rx.
Its intended purpose is to transform a value.
It is also known as `map`


Examples with arrays
=======================

{% highlight javascript %}
var a1 = [1, 3, 5];
var a2 = a1.map(function(val) { return val + 1; });
console.log('a1: ' + a1); // [1, 3, 5]
console.log('a2: ' + a2); // [2, 4, 6]
{% endhighlight %}
--------------------------

`map` and `select` act in the same way, except for with Rx, we assume its async.

Examples with Rx.
=======================

{% highlight javascript %}
var Rx = require('rx');
var a1 = [1, 3, 5];
var a2 = Rx.
    Observable.
    from(a1).
    select(function(x) {
        return x + 1;
    });
console.log('a1: ' + a1); // [1, 3, 5]

// Now the special sauce of rx
// logs 2, 4, 6
a2.subscribe(function(x) {
    console.log(x);
});
{% endhighlight %}
--------------------------


Going deeper.
=======================

To really understand the select operator, lets take apart the source code.
I find that this really helps me in understanding new technology.

First here is the `select` source.
{% highlight javascript %}
observableProto.select = observableProto.map = function (selector, thisArg) {
    var parent = this;
    return new AnonymousObservable(function (observer) {
        var count = 0;
        return parent.subscribe(function (value) {
            var result;
            try {
                result = selector.call(thisArg, value, count++, parent);
            } catch (exception) {
                observer.onError(exception);
                return;
            }
            observer.onNext(result);
        }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
    });
};
{% endhighlight %}
-----------------------

