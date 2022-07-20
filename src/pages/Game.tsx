import { doc, DocumentReference, onSnapshot } from "firebase/firestore"
import { FC, PropsWithChildren, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Center, Grid, SimpleGrid, Spinner, useToast } from "@chakra-ui/react"

import LetterSquare from "../components/LetterSquare"
import { roomsColl } from "../firebase"
import calculate from "../functions/calculate"
import { iRoom } from "../models/Room"

const Game: FC<PropsWithChildren<{}>> = props => {
	const location = useLocation()
	const navigate = useNavigate()
	const toast = useToast()

	const [username, setUsername] = useState<string | null>(null)
	const [roomRef, setRoomRef] = useState<DocumentReference<iRoom> | null>(null)
	const [room, setRoom] = useState<iRoom | null>(null)
	const [word, setWord] = useState<string | null>(null)
	const [letters, setLetters] = useState<string[][]>([])

	useEffect(() => {
		if (username === null) {
			const state = location.state as {
				username: string
				roomId: string
				word: string
			}

			if (state) {
				setUsername(state.username)
				setRoomRef(doc(roomsColl, state.roomId))
				setWord(state.word)
			} else {
				console.log("/")
				toast({
					title: "No game found",
					description: "Could not re-enter the game page",
					status: "error",
					duration: 2500
				})
			}
		}
	}, [username, location])

	useEffect(() => {
		if (roomRef === null || username === null) return

		console.log("snap")

		return onSnapshot(roomRef, doc => {
			if (doc.exists()) {
				const room = doc.data()

				if (username in room.game) {
					setRoom(doc.data())
				} else {
					// navigate("/")
					toast({
						title: "Kicked from room",
						description: "Someone removed you from the game",
						status: "error",
						duration: 2500
					})
				}
			} else {
				// navigate("/")
				toast({
					title: "Room Closed",
					description: "The game room has been closed",
					status: "error",
					duration: 2500
				})
			}
		})
	}, [roomRef, username])

	if (username === null || room === null || word === null) {
		return <Spinner />
	}

	return (
		<Center>
			<SimpleGrid columns={2}>
				<SimpleGrid
					columns={2}
					columnGap={4}
					rowGap={8}
					paddingRight={8}>
					{Object.entries(room.game ?? {}).map(([username, data]) => {
						const word = room.words[Object.keys(data).length - 1]!
						const guesses = [
							...data[word]!.flat(),
							...Array.from<null>(Array(30 - data[word]!.length * 5)).fill(null)
						]

						return (
							<Grid
								key={username}
								templateColumns="repeat(5, min-content)"
								gap={1.5}>
								{guesses.map((guess, i) => (
									<LetterSquare
										key={i}
										guess={guess}
										letter=""
										isSmall={true}
									/>
								))}
							</Grid>
						)
					})}
				</SimpleGrid>
			</SimpleGrid>
			<Center
				flexDirection="column"
				h="90vh">
				<Grid
					templateColumns="repeat(5, min-content)"
					gap={1.5}
					marginBottom={5}>
					{[...letters, ...Array.from<null>(Array(6 - letters.length)).fill(null)].map(
						(row, i) => {
							if (row?.every(letter => letter !== null)) {
								const result = calculate(word!, row!.join(""))
								return result.map((guess, i) => (
									<LetterSquare
										key={i}
										guess={guess}
										letter={row[i]!}
										isSmall={false}
									/>
								))
							} else if (row?.some(letter => letter !== null)) {
								return row!.map((letter, i) => (
									<LetterSquare
										key={i}
										guess={null}
										letter={letter}
										isSmall={false}
									/>
								))
							} else {
								return Array.from(Array(5)).map((_, i) => (
									<LetterSquare
										key={i}
										guess={null}
										letter=""
										isSmall={false}
									/>
								))
							}
						}
					)}
				</Grid>
				{/* <Keyboard /> */}
			</Center>
		</Center>
	)
}

export default Game
