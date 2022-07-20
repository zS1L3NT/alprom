import { Guess } from "../models/Room"

export default (answer: string, letters: string[]): (Guess | null)[] => {
	const guesses: Guess[] = []

	for (let i = 0; i < letters.length / 5; i++) {
		const word = letters.slice(i * 5, i * 5 + 5)
		if (word.length < 5) break
		
		for (let j = 0; j < 5; j++) {
			const letter = word[j]!
			if (answer.includes(letter)) {
				if (answer.indexOf(letter) === j) {
					guesses.push(Guess.Correct)
				} else {
					guesses.push(Guess.Partial)
				}
			} else {
				guesses.push(Guess.Incorrect)
			}
		}
	}

	return [...guesses, ...Array.from<null>(Array(30 - guesses.length)).fill(null)]
}
