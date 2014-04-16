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
    $("#sum").append("New Game is ready to play! <br/>");
    console.log(currGame.answer);
}

function recordText (w,l) {
    text = w.toString();
    text += "/";
    text += (w+l).toString();
    return text;

}



// function detectEnter(id,e) {
//     $(id).keypress (function(e) {
//         var code = e.keyCode ? e.keyCode : e.which;
//         if (code == 13) {
//            return true;
//         }
//     });
// }

function submitAnswer() {
    //got text from submit
    //replace any non-Digit characters (commas, white spaces etc) with empty string
    var guess = $("#guesstext").val().replace(/[\D]+/g, '');
    $("#guesstext").val('');

    if (!currGame.validateGuess(guess)) {
        alert("The passcode has four digits. Try again!");
    }
    else {
        if (currGame.n_guesses === 0 ) {
            $('#sum').html('');
        }

        //submit the guess in array form and get feedback
        var lastfb = currGame.submitGuess(currGame.toArrayGuess(guess));
        //append last feedback
        $("#sum").append("Guess #" + (currGame.n_guesses) + ": " + guess);
        $("#sum").append(" ---- " + lastfb[0] + "A" + lastfb[1] + "B <br/>");

        //win?
        if (lastfb[0] === currGame.n_digits) {
            currGame.win = true;
            $("#sum").append("Congratulations! You win! <br/>");
            alert("Congratulations! You win!");
            //TODO: save this game record somewhere

            total_win += 1;
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



var currGame = new Game(4);
var total_win = 0;
var total_lose = 0;

$(document).ready(function() { 
    genGame(currGame);

    $('#guesstext').keypress (function(e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 13) {
           submitAnswer();
           e.preventDefault();
        }
    });

    $('#submitbutton').click(submitAnswer);

    $("#guesstext").blur(function() {
        this.focus();
    });

});

// TODO
//Add some session logs to keep track of the win-lose records of a user



/*

var game_answer = new_game(4);
console.log(game_answer);
var guesses = 0;
var win = false;

while (guesses < 3) {
    var guess = prompt("Enter four digits from 0-9, separated by comma: \n");
    guess = guess.split(",").map(function(item) {
        return parseInt(item, 10);
    });

    console.log(guess);

    var feedback = get_feedback(game_answer, guess);

    if (feedback[0] === 4) {
        win = true;
        alert("Congratulations! You win!!!");
        break;
          
    }

    else {
        var str = "You got " + feedback[0] + " As and " + feedback[1] + " Bs correctly. ";
        alert(str);

        guesses += 1;
        
    }
}

if (!win) {
    var failstr = "Time's up! You failed!!! Loser is at Loserville......";
    alert(failstr);

}
*/













