export default (inputWord: string, correctWord: string) => {
	return inputWord.split("").map((letter, index) => {
		if (correctWord.indexOf(letter) == index) {
			return 3
		} else if (correctWord.includes(letter)) {
			return 2
		} else {
			return 1
		}
	})
}
