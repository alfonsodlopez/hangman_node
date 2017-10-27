/*Constructs a Letter object*/
var Letter = function Letter(letter) {
	this.value = letter
	this.hidden = true
	/*If hidden is true, print an underscore
	instead of the letter value*/
	this.display = function() {
		if(this.hidden === true) {
			process.stdout.write("_")
		}
		else {
			process.stdout.write(this.value)
		}
	}
}

module.exports = Letter