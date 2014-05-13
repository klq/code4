function Game (n) {
    this.n_digits = n;
    this.maxtry = 10;
    
    this.newGame = function() {
        this.n_guesses = 0;

        this.answer = [];
        this.guesses =[];
        this.feedback = [];
        this.win = '';

        while (this.answer.length < this.n_digits) {
            rand = Math.floor(Math.random() * 10);  //random digits from 0-9 
            if ($.inArray(rand, this.answer) < 0) { // no repeating digits
                this.answer.push(rand);
            }
        }
    };
 
    this.feedbackGame = function(guess) {
        var place_hits = 0;
        var digit_hits = 0;
        
        for (var i=0; i < this.answer.length; i++) {
            for (var j=0; j < guess.length; j++) {
                if (this.answer[i] === guess[j]) {
                    if (i===j) {
                        place_hits += 1; //both place and digit
                    }
                    else {
                        digit_hits += 1; //only digit but no place hit
                    }
                }
            }
        }
    this.feedback.push([place_hits, digit_hits]); 
    };

    this.saveGame = function() {   
    }

    this.validateGuess = function(guess) {
        // length = n_digits and consists of only digits
        return (guess.length == this.n_digits && /^\d+$/.test(guess));

    };

    this.submitGuess = function(guess) {
        this.n_guesses += 1;
        this.guesses.push(guess);
        this.feedbackGame(guess);
   
        return this.feedback[this.n_guesses-1];
    };

    this.toArrayGuess = function(guess) {
        return guess.split('').map(function(item) {
            return parseInt(item, 10);
        });
    }

} // end of Game()

function genGame (game) {
    game.newGame();
    $("#game-info").append("Ready to play? <br> Enter your guesses in the box! <br/>");
    // console.log(currGame.answer);
}

function recordText (w,l) {
    text = w.toString();
    text += "/";
    text += (w+l).toString();
    return text;

}

function submitAnswer() {
    //got text from submit
    //replace any non-Digit characters (commas, white spaces etc) with empty string
    var guess = $("#guesstext").val().replace(/[\D]+/g, '');
    $("#guesstext").val('');

    if (!currGame.validateGuess(guess)) {
        alert("The passcode has four digits. Try again!");
    }
    else { //clear the game-info text after submitting the first guess
        if (currGame.n_guesses === 0 ) {
            $('#game-info').html('');
        }

        //submit the guess in array form and get feedback
        var lastfb = currGame.submitGuess(currGame.toArrayGuess(guess));
        //prepend last feedback
        $("#game-info").append("#" + (currGame.n_guesses) + ":  " + guess);
        $("#game-info").append(" - " + lastfb[0] + "A" + lastfb[1] + "B <br/>");
        
        

        //win?
        if (lastfb[0] === currGame.n_digits) {
            currGame.win = true;
            curr_score = getScore();
            if (curr_score > best_score) {
                best_score = curr_score;
            }
            total_score += curr_score;
            total_win += 1;
            
            //TODO: save this game record somewhere
            $("#game-info").append("Congratulations! You win! <br/>");
            alert("Congratulations! You win!");

            $(".score-container").html(total_score);
            $(".best-container").html(best_score);
            $(".record-container").html(recordText(total_win,total_lose));

            genGame(currGame);
        }
        else {
            //check if used up all guesses
            if (currGame.n_guesses === currGame.maxtry) {
                alert("Game Over! You lost.");
                currGame.win = false;
                total_lose += 1;
                $(".record-container").html(recordText(total_win,total_lose));
                // save this record
                genGame(currGame);
            }        
        }
        
    }
}


function getScore() {
    guess = currGame.n_guesses;
    switch (guess) {
        case 1:  return 10; 
        case 2:  return 9;
        case 3:  return 8;
        case 4:  return 7;
        case 5:  return 6;
        case 6:  return 5;
        case 7:  return 4;
        case 8:  return 3;
        case 9:  return 2;
        case 10: return 1;
        default: return -1;
    }
}

var currGame = new Game(4);
var total_win = 0;
var total_lose = 0;
var best_score = 0;
var total_score = 0;
var curr_score = 0;

$(document).ready(function() { 
    genGame(currGame);

    $('#guesstext').keypress (function(e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 13) {
           submitAnswer();
           e.preventDefault();
        }
    });

    $('button').click (function() {
        
        var current_text = $('#guesstext').val();
        var button_digit = $(this).attr("value");

        if (button_digit == 'r') {
            submitAnswer();
            $('.btn').removeClass("pressed");
            $('.btn').removeAttr('disabled');
        }
        else if (button_digit == 'd') {
            if ( current_text.length == 0 ) {
                return
            }

            last_digit = current_text[current_text.length - 1];
            current_text = current_text.substring(0, current_text.length - 1);
            $('#guesstext').val(current_text);   

            $('button[value=' + last_digit + ']').removeClass("pressed");
            $('button[value=' + last_digit + ']').removeAttr("disabled");
        
        }
        else {

            $(this).attr('disabled','disabled');
            $(this).addClass("pressed");

            current_text += button_digit;
            $('#guesstext').val(current_text);

        }

        
    });

    $("#guesstext").blur(function() {
        this.focus();
    });

    

});

// TODO
//Add some session logs to keep track of the win-lose records of a user













