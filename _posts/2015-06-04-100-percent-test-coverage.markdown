---
layout: post
title: 100% Test Coverage
category: testing
permalink: /software/100-percent-is-bad-a-bad-metric
---

### 100% Test Coverage is a Bad Metric

Unit tests, developer's best friends, help the maintainability
of a code base.  But what makes a unit test good?  What makes
a test superfluous vs. effective?

### Improving you unit test foo.

For the last 3 years I have actively written unit tests for
20-100% of my job.  It became clear that my earlier unit tests
were not so good as bugs existed in the code, though i had
coverage.  In fact, more than once, I had 100% coverage and
somehow ended up with several bugs.  It became clear that
coverage does not imply quality

Lets create a simple method, `isPathValue`.  What is a PathValue?
A PathValue is any javascript object that only has a `path` and a
`value` key.  Lets just write the simplest version of `isPathValue`.
The function contains several bugs which we will capture through
unit testing.

{% highlight javascript %}
// Checks to see if x is or is not a PathValue.
function isPathValue(x) {
    return x.path && x.value;
}
{% endhighlight %}

#### Output space

In our example, the output space is requires a minimum amount of tests.
Since the output type is boolean, there are only two potential values,
`true` or `false`.

{% highlight javascript %}
// Output Space tests
describe('PathValue - Output Space', function() {
    it('should successfully identify a path value.', function() {
        expect(isPathValue({path: 'foo', value: 'bar'})).to.be.ok;
    });
    it('should successfully identify a non path value.', function() {
        expect(isPathValue({path: 'foo', values: 'bar'})).to.not.be.ok;
    });
});
{% endhighlight %}

For this example the output space is a great place to start testing.  Its
limited in scope and hopefully will catch some simple bugs.  As a side
note, we have achieved 100% coverage, despite very little testing.

#### Input Space

In our example, input space is more complex.  There are several types
and values that could be passed in.  The potential values of `x` could be:

- null, undefined
- NaN, Infinity
- string
- number
- object
- array
- boolean

And the values for `path` and `value` can be any type from above.  Now its
time to narrow down the potential tests since we don't want to write 7
tests for the value of `x` and 7x7 for `x.path` and `x.value`.  Instead, lets
redefine the input space and group together like values.

Falsey: Simple (skipping the more advanced falseys).

- NaN
- null
- undefined
- false

Values that throw errors when accessed with dot separators.

- null
- undefined

Values that don't throw errors when accessed with dot separators:

- string
- number
- object
- array
- boolean
- function

Values that properties can be added to:

- function
- object
- array

With that definition lets define our tests:
Falsy value for `x`, `x.value`, and `x.path`.
`x` should be a value that will throw errors if dot separators are used.

{% highlight javascript %}
describe('PathValue - Input Space', function() {
    it('should test null for x', function() {
        expect(isPathValue(null)).to.not.be.ok;
    });
    it('should test x.path as falsey.', function() {
        expect(isPathValue({path: false, value: 'foo'})).to.be.ok;
    });
    it('should test x.value as falsey.', function() {
        expect(isPathValue({path: 'foo', value: false})).to.be.ok;
    });

    // ... continued ...
{% endhighlight %}

One of the requirements is that the object _only_ has `path` and `value`.
`x` should have more than just `path` and `value`
{% highlight javascript %}
    // ... continued ...
    it('should reject an object with more than path and value.', function() {
        expect(isPathValue({
            path: 'foo',
            value: 'bar',
            baz: 'buzz'
        })).to.not.be.ok;
    });
    // ... continued ...
{% endhighlight %}

`x` must be a _javascript object_.  `x` should be an `array|function`
with a `path` and `value` key to ensure we object check.

{% highlight javascript %}
    // ... continued ...
    it('should ensure that an array is never a path value.', function() {
        var val = [];
        val.path = 'foo';
        val.value = 'foo';
        expect(isPathValue(val)).to.not.be.ok;
    });
    it('should ensure that a function is never a path value.', function() {
        var val = function() {};
        val.path = 'foo';
        val.value = 'foo';
        expect(isPathValue(val)).to.not.be.ok;
    });
});
{% endhighlight %}

### Results

Several bugs will be found, including errors that are thrown.  So lets
rewrite the `isPathValue` function to correctly pass all of our unit tests.

{% highlight javascript %}
// Checks to see if x is or is not a PathValue.
var isArray = Array.isArray;
function isPathValue(x) {
    // Null, Non Object, or Array case
    if (!x || typeof x !== 'object' || isArray(x)) {
        return false;
    }

    // Extra / not enough keys.
    var keys = Object.keys(x);
    if (keys.length > 2 || keys.length < 2) {
        return false;
    }

    return x.hasOwnProperty('path') && x.hasOwnProperty('value');
}
{% endhighlight %}

### Take Away

Unit test coverage is a metric that does not indicate quality of tests.
One of the most important things to take away is testing functions should
never consider internal implementations.  Tests should only consider the
interface.  This way, as the internals change, we ensure that the contract
continues to work.

### One Note

The testing here only considers function testing, Object testing is
considerably harder since method behavior can be/is little/largly driven by
the state of the Object.



