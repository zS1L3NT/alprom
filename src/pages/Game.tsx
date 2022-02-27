import Keyboard from "../components/Keyboard"
import LetterBox from "../components/LetterBox"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { firestore } from "../firebase"
import { onRoomUpdate } from "../app/slices/room"
import { popLetter, pushLetter } from "../app/slices/letters"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { useAppSelector } from "../hooks/useAppSelector"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { wordList } from "../dictionary"
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Center,
	Grid,
	SimpleGrid,
	useToast,
} from "@chakra-ui/react"

const Game = () => {
	const toast = useToast()
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const room = useAppSelector(state => state.room)
	const currentRow = useAppSelector(state => state.letters.row)
	const currentWordRaw = useAppSelector(
		state => state.letters.data[currentRow],
	)
	const wordArrays = useAppSelector(state => state.letters)
	const [isValid, setIsValid] = useState(true)
	const [currentWord, setCurrentWord] = useState("")

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

	useEffect(() => {
		setCurrentWord(
			currentWordRaw
				.map(l => l.letter)
				.join("")
				.toLowerCase(),
		)
	}, [currentWordRaw])

	useEffect(() => {
		const unsub = onSnapshot(
			query(
				collection(firestore, "rooms"),
				where("code", "==", room?.code),
			),
			doc => {
				if (doc.docs.length === 1) {
					dispatch(onRoomUpdate(doc.docs[0]!.data()))
				} else {
					toast({
						title: "Error",
						description: "Room closed!!",
						status: "error",
						duration: 2500,
						isClosable: true,
						onCloseComplete: () => {
							navigate("/")
						},
					})
				}
			},
		)

		return unsub
	}, [room?.code])

	useEffect(() => {
		if (currentWord.length == 5) {
			setIsValid(wordList.includes(currentWord))
		}

		const handler = (event: KeyboardEvent) => {
			switch (event.key) {
				case "Backspace":
					dispatch(popLetter())
					setIsValid(true)
					break
				case "Enter":
					//dispatch(nextRow())
					//checkWord()

					if (isValid) {
						// code to check against answer word

						console.log(currentWord)
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
		}

		document.addEventListener("keydown", handler)

		return () => {
			document.removeEventListener("keydown", handler)
		}
	}, [currentWord])

	useEffect(() => {
		!isValid
			? toast({
					id: "invalid-word-toast",
					title: "Invalid Word",
					description: "The word you entered doesn't exist!",
					status: "error",
					isClosable: true,
					position: "top-right",
			  })
			: toast.close("invalid-word-toast")
	}, [isValid])

	return (
		<Center>
			<SimpleGrid columns={2}>
				{/* left side players */}
				<SimpleGrid
					columns={2}
					columnGap={4}
					rowGap={8}
					paddingRight={8}>
					{/* map player scores dictionary to 6x6 grid */}
					{Object.keys(room.scores || {}).map((key, index) => {
						// get each player's guesses
						var guessesArr = room.scores![key].guesses
						return (
							<Grid
								key={index}
								templateColumns="repeat(5, min-content)"
								gap={1.5}>
								{Array(30)
									.fill(0)
									.map((_, i) =>
										guessesArr == undefined ? (
											<></>
										) : (
											<LetterBox
												key={`${index}-${i}`}
												state={guessesArr[i]}
												isSmall={true}
											/>
										),
									)}
							</Grid>
						)
					})}
				</SimpleGrid>
			</SimpleGrid>

			{/* main grid and keyboard */}
			<Center flexDirection="column" h="90vh">
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
	)
}

export default Game
