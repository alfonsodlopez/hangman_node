/*Constructs a Word object*/
var Word = function RandomWord(word) {
	var Letter = require("./letter.js")
	this.letters = []
	this.string = word
	this.correctGuesses = this.string.length
	this.incorrectGuesses = 8
	this.previousGuesses = []
	/*Stores an array of Letter objects*/
	for(var i =0; i<this.correctGuesses; i++){
		var letter = new Letter(this.string[i])
		this.letters.push(letter)
	}
	/*Print method prints out the array of letter
	objects based on their display attributes*/
	this.print = function() {
		console.log("\n")
		for(var i=0; i<this.letters.length; i++) {
			this.letters[i].display()
		}
		console.log("\n")
	}
}

module.exports = Word