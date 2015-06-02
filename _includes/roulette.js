var REDS = {
    1: true,
    3: true,
    5: true,
    7: true,
    9: true,
    12: true,
    14: true,
    16: true,
    18: true,
    19: true,
    21: true,
    23: true,
    25: true,
    27: true,
    30: true,
    32: true,
    34: true,
    36: true
};

var BLACKS = {
    2: true,
    4: true,
    6: true,
    8: true,
    10: true,
    11: true,
    13: true,
    15: true,
    17: true,
    20: true,
    22: true,
    24: true,
    26: true,
    28: true,
    29: true,
    31: true,
    33: true,
    35: true
};

function spin() {
    return Math.floor(Math.random() * 38);
}

var RED = 'red';
var BLACK = 'black';
var HOUSE = 'green';
function getColor(number) {
    if (BLACKS[number]) {
        return BLACK;
    }
    if (REDS[number]) {
        return RED;
    }
    return HOUSE;
}

function rouletteTracker() {
    var count = BLACK, color = 0;

    // Keeps track of the roulette board
    return function() {
        var results = spin();
        var rColor = getColor(results);

        if (color === rColor) {
            count++;
        }

        else {
            count = 1;
            color = rColor;
        }

        return {
            count: count,
            color: color
        };
    };
}

function doTheBetting(opts) {
    var bettingAmount = opts.bettingAmount;
    var cash = opts.cash;
    var inARow = opts.inARow;
    var max = opts.max;
    var counter = 0;
    var refresh = opts.refresh;
    var tracker = rouletteTracker();

    for (;cash > 0 && cash < max; ++counter) {
        var res = tracker();

        // Essentially we only play 1 in a row if it equals the inARow marker.
        // technically there is a doubling down strategy we could apply, but we wont.
        if (res.count >= inARow) {
            var color = res.color;
            var betAmount = bettingAmount(cash, res);
            var betColor = color === BLACK ? RED : BLACK;
            var nextRes = tracker();
            cash -= betAmount;

            console.log('making bet', cash, betAmount, nextRes.color, betColor);
            if (nextRes.color === betColor) {
                cash += betAmount * 2;
            }

            if (refresh) {
                tracker = rouletteTracker();
            }
        }
    }

    console.log('Stats:');
    console.log('After', counter, 'games you have', cash, 'left.');
}

// Simple 50 at a time betting.
doTheBetting({
    bettingAmount: function(cash, res) {
        if (cash < 50) {
            return cash;
        }
        return 50;
    },
    max: 2000,
    inARow: 5,
    cash: 500,
    refresh: true
});

// Simple 50 w/ 50 follow ups.
doTheBetting({
    bettingAmount: function(cash, res) {
        if (cash < 50) {
            return cash;
        }
        return 50;
    },
    max: 2000,
    inARow: 5,
    cash: 500,
    refresh: false
});

// Simple 50 w/ exponential follow ups.
doTheBetting({
    bettingAmount: function(cash, res) {
        if (cash < 50) {
            return cash;
        }
        var calc = Math.pow(2, res.count - 3) * 50;
        return calc > cash ? cash : calc;
    },
    max: 2000,
    inARow: 5,
    cash: 500,
    refresh: false
});
