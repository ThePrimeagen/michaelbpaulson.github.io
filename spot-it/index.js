$(function() {
    $('.calc').click(function() {
        var $inputs = $('input');
        var scores = [[], [], [], [], []];
        var totals = [0, 0, 0, 0];
        var players = 4;
        var rounds = 5;
        for (var i = 0; i < $inputs.length; i++) {
            var $input = $($inputs[i]);
            var data = $inputs[i].id.split('_');
            var round = data[0];
            var player = data[1];

            scores[player][round] = Number($input.val());
        }

        for (var r = 0; r < rounds; r++) {
            var roundScores = [];

            var allZero = true;
            for (var p = 0; p < players; p++) {
                roundScores[p] = {p: p, score: scores[p][r]};

                if (scores[p][r] > 0) {
                    allZero = false;
                }
            }

            if (allZero) {
                continue;
            }

            roundScores.sort(function(a, b) {
                if (a.score > b.score) {
                    return 1;
                } else if (a.score < b.score) {
                    return -1;
                }
                return 0;
            });

            // so lame
            if (r === 0) {
                var rS = roundScores.reverse();
                rS[0].score += 5;
            } else if (r === 1) {
                roundScores[0].score += 10;
                roundScores[roundScores.length - 1].score += -20;
            } else if (r === 3) {
                roundScores[0].score += 20;
                roundScores[1].score += 10;
            } else if (r === 4) {
                var rS = roundScores.reverse();
                rS[0].score += 5;
            }

            for (var i = 0; i < roundScores.length; i++) {
                totals[roundScores[i].p] += roundScores[i].score;
            }
        }

        for (var t = 0; t < totals.length; t++) {
            $('#score' + t).html(totals[t]);
        }
    });
});

