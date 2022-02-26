import Keyboard from "../components/Keyboard"
import LetterBox from "../components/LetterBox"
import { Box, Center, Grid, SimpleGrid, toast, useToast, VStack } from "@chakra-ui/react"
import { nextRow, popLetter, pushLetter } from "../app/slices/letters"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { useAppSelector } from "../hooks/useAppSelector"
import { useEffect, useState } from "react"

import { wordList } from "../dictionary"
import { onSnapshot, query, collection, where } from "firebase/firestore"
import { onRoomUpdate } from "../app/slices/room"
import { firestore } from "../firebase"
import { useNavigate } from "react-router-dom"

const Game = () => {
	const dispatch = useAppDispatch()

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
	const toast = useToast()
	const navigate = useNavigate()

	// get data from redux
	const wordArrays = useAppSelector(state => state.letters)
	const room = useAppSelector(state => state.room)
	console.log("players state",room)

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
		document.addEventListener("keydown", event => {
			switch (event.key) {
				case "Backspace":
					dispatch(popLetter())
					break
				case "Enter":
					dispatch(nextRow())
					// Submits the word

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
						{/* map player scores dictionary to 6x6 grid */}
						{Object.keys(room.scores || {} ).map((key, index) => {
							// get each player's guesses
							var guessesArr = room.scores![key].guesses
							return (
								<Grid
									key={index}
									templateColumns="repeat(5, min-content)"
									gap={1.5}>
									{Array(30)
										.fill(0)
										.map((_, i) => (
											guessesArr == undefined ? <></> :
											<LetterBox
												key={`${index}-${i}`}
												state={guessesArr[i]}
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
					<Grid
						templateColumns="repeat(5, min-content)"
						gap={1.5}
						marginBottom={10}>
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
