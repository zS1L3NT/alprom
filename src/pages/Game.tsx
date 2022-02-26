import { useEffect, useState } from "react"
import LetterBox from "../components/LetterBox"
import Keyboard from "../components/Keyboard"
import { Box, Center, Grid, SimpleGrid, VStack } from "@chakra-ui/react"
import { useAppSelector } from "../hooks/useAppSelector"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { popLetter, pushLetter, nextRow } from "../app/slices/letters"

const Game = () => {
	const dispatch = useAppDispatch()
	const [currentRow, setCurrentRow] = useState(0)

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

	const testArray = [
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
		{ letter: "", state: 0 },
	]

	const current = [] as Array<string>

	const wordArrays = useAppSelector(state => state.letters)

	useEffect(() => {
		document.addEventListener("keydown", event => {
			switch (event.key) {
				case "Backspace":
					console.log("Back")
					dispatch(popLetter())
					break
				case "Enter":
					console.log("Enter")
					dispatch(nextRow())

					// Submits the word
					break
				default:
					// console.log(event.key)
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
			<Box
				h="6vh"
				mb="2.5vh"
				w="100%"
				borderWidth="1px"
				borderColor="white">
				Game
			</Box>

			<Center
				flexDirection="column"
				h="90vh"
				justifyContent="space-between">
				<Grid templateColumns="repeat(5, min-content)" gap={1.5}>
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
		</>
	)
}

export default Game
