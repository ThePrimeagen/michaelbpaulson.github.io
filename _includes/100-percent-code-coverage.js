var expect = require('chai').expect;
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

describe('PathValue - Output Space', function() {
    it('should successfully identify a path value.', function() {
        expect(isPathValue({path: 'foo', value: 'bar'})).to.be.ok;
    });
    it('should successfully identify a non path value.', function() {
        expect(isPathValue({path: 'foo', values: 'bar'})).to.not.be.ok;
    });
});

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

    it('should reject an object with more than path and value.', function() {
        expect(isPathValue({
            path: 'foo',
            value: 'bar',
            baz: 'buzz'
        })).to.not.be.ok;
    });
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

