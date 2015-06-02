---
layout: post
title: 100% Test Coverage
category: testing
---

### 100% Test Coverage
##### is a bad metric
Unit tests are developers best friends when it comes to
maintainability.  There is only one problem.  What makes
a unit test good?  How do i know i am writing unit tests that
effectively test the product vs superfolous test that tests
the same thing over and over again?

For the last 3 years i have actively written unit tests for
20-30% of my job.  It became clear that my earlier unit tests
were not so good as bugs existed in the code, though i had.
coverage.  It may not be clear, so lets take a look at an examlpe.

```javascript
// Lets write a quick object tester.
// Say in our system we have PathValues, and PathValues
// are serializable and have 2 properties: path and value.
// We don't have an object, but instead we just look for
// those properties.
function isPathValue(x) {
    return x.hasOwnProperty('path') && x.hasOwnProperty('value);
}
```

This is a pretty trivial example but it will get the job done.
Lets write a unit test for this.

```javascript
// Assuming some mocha like tests.
describe('PathValue', function() {
    it('should successfully identify a path value.', function() {
        expect(isPathValue({path: 'foo', value: 'bar'}).to.be.ok;
    });
    it('should successfully identify a non path value.', function() {
        expect(isPathValue({path: 'foo', values: 'bar'}).to.not.be.ok;
    });
});
```

This works great!  Not only that, but we get 100% test coverage!
I would say a job well done, time to watch some Netflix!  But wait!
What is our input space?  Is it always objects?  How about null?  Its
a typeof null === 'object'.  It should be clear, even from this
simple example that 100% test coverage doesn't mean the code is safe.


### Improving you unit test foo.
If 100% code coverage is not a reliable metric, what is?
