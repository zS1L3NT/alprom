import { FC, PropsWithChildren, useEffect, useState } from "react"
import { FaBackspace } from "react-icons/fa"

import { Button, HStack, Icon, VStack } from "@chakra-ui/react"

import getGuesses from "../functions/getGuesses"
import { Guess } from "../models/Room"
import Key from "./Key"

const keys = [
	"Q",
	"W",
	"E",
	"R",
	"T",
	"Y",
	"U",
	"I",
	"O",
	"P",
	"A",
	"S",
	"D",
	"F",
	"G",
	"H",
	"J",
	"K",
	"L",
	"Z",
	"X",
	"C",
	"V",
	"B",
	"N",
	"M"
]

const Keyboard: FC<
	PropsWithChildren<{
		word: string
		letters: string[]
		submittedLetters: string[]
	}>
> = props => {
	const { word, letters, submittedLetters } = props

	const [guesses, setGuesses] = useState(getGuesses(word, letters))

	useEffect(() => {
		setGuesses(getGuesses(word, letters))
	}, [word, letters])

	const getKeyGuess = (key: string): Guess | null => {
		if (letters.includes(key)) {
			const is = letters
				.map((letter, i) => (letter === key ? i : null))
				.filter(i => i !== null) as number[]

			let guess: Guess | null = null
			for (const i of is) {
				const guess_ = guesses[i]
				if (!guess_ || !submittedLetters[i]) continue

				if (guess_ === Guess.Correct) return Guess.Correct
				else guess = guess_
			}

			return guess
		}
		return null
	}

	return (
		<VStack
			justify="center"
			spacing={1.5}>
			<HStack spacing={1.5}>
				{keys.slice(0, 10).map((key, i) => (
					<Key
						key={key}
						letter={key}
						guess={getKeyGuess(key)}
					/>
				))}
			</HStack>
			<HStack spacing={1.5}>
				{keys.slice(10, 19).map((key, i) => (
					<Key
						key={key}
						letter={key}
						guess={getKeyGuess(key)}
					/>
				))}
			</HStack>
			<HStack spacing={1.5}>
				{/* TODO: Enter key updates current player's firestore value */}
				<Button
					h="60px"
					w="60px"
					border="1px"
					borderColor="transparent"
					borderRadius={2}
					bg="hsl(200, 1%, 51%)"
					color="white">
					ENTER
				</Button>
				{keys.slice(19, 27).map((key, i) => (
					<Key
						key={key}
						letter={key}
						guess={getKeyGuess(key)}
					/>
				))}
				<Button
					h="60px"
					w="60px"
					border="1px"
					borderColor="transparent"
					borderRadius={2}
					bg="hsl(200, 1%, 51%)"
					color="white">
					<Icon
						boxSize={6}
						as={FaBackspace}
					/>
				</Button>
			</HStack>
		</VStack>
	)
}

export default Keyboard
