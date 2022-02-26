import Keyboard from "../components/Keyboard"
import LetterBox from "../components/LetterBox"
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Center,
	Grid,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react"
import { nextRow, popLetter, pushLetter } from "../app/slices/letters"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { useAppSelector } from "../hooks/useAppSelector"
import { useEffect, useState } from "react"

import { wordList } from "../dictionary"

const Game = () => {
	const dispatch = useAppDispatch()
	const [isValid, setIsValid] = useState(true)
	const [currentWord, setCurrentWord] = useState("")
	const currentWordRaw = useAppSelector(
		state => state.letters.data[useAppSelector(state => state.letters.row)],
	)
	const currentWordList: string[] = []

	const alphabet = [
		"a",
		"b",
		"c",
		"d",
		"e",
		"f",
		"g",
		"h",
		"i",
		"j",
		"k",
		"l",
		"m",
		"n",
		"o",
		"p",
		"q",
		"r",
		"s",
		"t",
		"u",
		"v",
		"w",
		"x",
		"y",
		"z",
	]

	const dummyData: any = {
		putt: {
			points: 0,
			round: 0,
			guesses: [
				0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0,
			],
		},
		joey: {
			points: 0,
			round: 0,
			guesses: [
				0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0,
			],
		},
		zec: {
			points: 0,
			round: 0,
			guesses: [
				0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0,
			],
		},
		nitish: {
			points: 0,
			round: 0,
			guesses: [
				0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0,
			],
		},
	}

	useEffect(() => {
		currentWordRaw.map(wordList => {
			currentWordList.push(wordList.letter)
		})
		setCurrentWord(currentWordList.join("").toLowerCase())
	}, [currentWordRaw])

	useEffect(() => {
		if (currentWord.length == 5) {
			setIsValid(wordList.includes(currentWord))
		}
	}, [currentWord])

	const wordArrays = useAppSelector(state => state.letters)

	useEffect(() => {
		document.addEventListener("keydown", event => {
			switch (event.key) {
				case "Backspace":
					dispatch(popLetter())
					setIsValid(true)
					break
				case "Enter":
					dispatch(nextRow())
					if (isValid) {
						console.log(currentWord)
						// code to check against answer word
					}
					// Submits the word
					setIsValid(true)
					break
				default:
					if (alphabet.includes(event.key.toLowerCase())) {
						dispatch(
							pushLetter({
								letter: event.key.toUpperCase(),
								state: 0,
							}),
						)
					}
					break
			}
		})
	}, [])

	return (
		<>
			<Center>
				<SimpleGrid columns={2}>
					{/* left side players */}
					<SimpleGrid
						columns={2}
						columnGap={4}
						rowGap={8}
						paddingRight={8}>
						{Object.keys(dummyData).map((key, index) => {
							const guesses = dummyData[key].guesses
							return (
								<Grid
									templateColumns="repeat(5, min-content)"
									gap={1.5}>
									{Array(30)
										.fill(0)
										.map((_, i) => (
											<LetterBox
												key={i}
												state={guesses[i]}
												isSmall={true}
											/>
										))}
								</Grid>
							)
						})}
					</SimpleGrid>
				</SimpleGrid>

				{/* main grid and keyboard */}
				<Center flexDirection="column" h="90vh">
					{isValid ? (
						<></>
					) : (
						<Alert mb={3} status="error" display="inherit">
							<AlertIcon />
							<AlertTitle mr={2}>
								The word you entered doesn't exist!
							</AlertTitle>
							<AlertDescription>
								Please type another word.
							</AlertDescription>
						</Alert>
					)}
					<Grid
						templateColumns="repeat(5, min-content)"
						gap={1.5}
						marginBottom={5}>
						{wordArrays.data.flat().map((letter, index) => (
							<LetterBox
								key={index}
								state={letter.state}
								letter={letter.letter}
							/>
						))}
					</Grid>
					<Keyboard />
				</Center>
			</Center>
		</>
	)
}

export default Game
