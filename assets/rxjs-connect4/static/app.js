var $ = require('jquery');
$(function() {
    var RxConnect4 = require('RxConnect4');
    var rxConnect4 = new RxConnect4($('#game'));
    rxConnect4.start();
});

