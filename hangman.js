

/*
Remember to include a package.json file containing your project dependencies
in your Github repo!*/

/*---------------------------------------------------------------------------*/

/*Flow of program:
getRandomWord() --> playGame() --> constructors  -->
Repeat the following: [checkForwin() --> getGuess() --> checkGuess()]
Prompt user to call getRandomWord()*/
 
function getRandomWord() {
	/*Calls the Wordnik API at the randomword endpoint to retrieve a random word.
	The word is set between 5-11 letters long. On success the response is parsed
	for the word and passed to playGame*/
	var rp = require("request-promise-native")
	var options = {
	    method: 'GET',
	    uri: 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=11&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
	    resolveWithFullResponse: true    
	};
 
	rp(options)
    .then(function(response) {
        var word = JSON.parse(response["body"])["word"].toUpperCase();
        playGame(word)
    })
    .catch(function (err) {
        console.log(err)
    });
}

function getGuess(Word) {
	/*Prompt user for a letter*/
	var inquirer = require("inquirer")
	inquirer.prompt([{
		type: 'input',
		name: 'letter',
		message: 'Guess a letter.',
		/*Regex expression to validate single letter entered*/
		validate: function(value) {
			var letter = value.match(/^[A-Za-z]$/);
			var unique = !(Word.previousGuesses.includes(letter[0].toUpperCase()))
			console.log("\nPrevious Guesses: "+Word.previousGuesses)
			if(letter && unique === true) {
				Word.previousGuesses.push(letter[0].toUpperCase())
				return true
			}
			else {
				console.log("\n\nPlease enter a unique single letter\n")
			}
		}
	}])
	
	.then(function (answer) {
		/*This gets the letter from the prompt. It is at position 11 of 
		the string*/
		guess = JSON.stringify(answer)[11].toUpperCase()
		/*Pass the values back to checkGuess*/
		return checkGuess(Word, guess)
	})
}

function checkGuess(Word, guess) {
	/*When provided with a letter, loop through letter objects to compare
	values against user input. If there is a match, update the appropriate
	letter objects to display and decrement correctGuesses, else decrement
	incorrectGuesses*/
	var goodGuess = false
	console.log(guess)
	for(var i=0; i<Word.letters.length; i++) {
		if(Word.letters[i].value === guess) {
			Word.letters[i].hidden = false
			Word.correctGuesses -= 1
			goodGuess = true
		}
	}
	if(goodGuess === false) {
		Word.incorrectGuesses -= 1
	}
	checkForWin(Word)
}

function checkForWin(Word) {
	/*Checks guess counts
	If correctGuesses === 0, user wins,
	if incorrectGuesses === 0 user loses,
	prompt user if they want to start again.*/
	console.log("Letters remaining: "+Word.correctGuesses+"\nGuesses remaining: "+Word.incorrectGuesses)
	/*Check if they still have more guesses*/
	if(Word.correctGuesses > 0 && Word.incorrectGuesses > 0) {
		Word.print()
		getGuess(Word)
	}
	else {
		/*Let user know if they won or lost*/
		var inquirer = require("inquirer")
		if(Word.correctGuesses === 0) {
			console.log("You win!")
		}
		else {
			console.log("You lose!\nThe word was "+Word.string)
		}
		/*Ask the user if they want to play again*/
		inquirer.prompt([{
			type: 'list',
			name: 'play_again',
			message: 'Play again? ',
			choices: [
			  'Yes',
			  'No'
			]	
		}])
		.then(function(answer) {
			/*This is really dumb, but parsing it immediately
			gives an error. For some reason this works.*/
			answer = JSON.stringify(answer, null, '  ')
			answer = JSON.parse(answer)['play_again']
			if(answer === "Yes") {
				return getRandomWord()
			}
			else {
				return console.log("See ya!")
			}
		})
	}
}
function playGame(word) {
	/*word is taken and immediately calls Word constructor*/
	var Word = require("./word.js")
	Word = new Word(word)
	console.log("The word is "+Word.correctGuesses+" letters long")
	checkForWin(Word)
}

getRandomWord()
