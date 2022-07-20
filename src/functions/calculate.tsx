import { Guess } from "../models/Room"

export default (word: string, guess: string): Guess[] => {
	const wordLetters = word.split("")
	const guessLetters = guess.split("")

	return guessLetters.map((guessLetter, i) => {
		if (wordLetters.includes(guessLetter)) {
			if (wordLetters.indexOf(guessLetter) === i) {
				return Guess.Correct
			} else {
				return Guess.Partial
			}
		} else {
			return Guess.Incorrect
		}
	})
}
