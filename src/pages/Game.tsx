import { doc, DocumentReference, onSnapshot, updateDoc } from "firebase/firestore"
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
	const [letters, setLetters] = useState<string[][]>([[]])

	const alphabet = Array.from(Array(26)).map((_, i) => String.fromCharCode(i + 65))

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

		return onSnapshot(roomRef, doc => {
			if (doc.exists()) {
				const room = doc.data()

				if (username in room.game) {
					setRoom(doc.data())
				} else {
					navigate("/")
					toast({
						title: "Kicked from room",
						description: "Someone removed you from the game",
						status: "error",
						duration: 2500
					})
				}
			} else {
				navigate("/")
				toast({
					title: "Room Closed",
					description: "The game room has been closed",
					status: "error",
					duration: 2500
				})
			}
		})
	}, [roomRef, username])

	useEffect(() => {
		if (roomRef === null || room === null || username === null || word === null) return

		const handler = async (e: KeyboardEvent) => {
			switch (e.key) {
				case "Backspace":
					setLetters(letters => {
						if (letters.length === 0) return [[]]

						const row = letters.at(-1)!
						if (row.length === 1) return [...letters.slice(0, -1), []]

						return [...letters.slice(0, -1), row.slice(0, -1)]
					})
					break
				case "Enter":
					setLetters(letters => {
						if (letters.at(-1)!.length === 5) {
							updateDoc(roomRef, `game.${username}.${word}`, [
								...room!.game[username]![word]!,
								...calculate(word!, letters.at(-1)!.join(""))
							])
							return [...letters, []]
						} else {
							return letters
						}
					})
					break
				default:
					if (alphabet.includes(e.key.toUpperCase())) {
						setLetters(letters => {
							if (letters.length === 1) {
								if (letters[0]!.length === 0) return [[e.key.toLowerCase()]]
								if (letters[0]!.length === 5) return letters
								return [[...letters[0]!, e.key.toLowerCase()]]
							}

							if (letters.at(-1)!.length === 5) return letters

							return [
								...letters.slice(0, -1),
								[...letters.at(-1)!, e.key.toLowerCase()]
							]
						})
					}
					break
			}
		}

		window.addEventListener("keydown", handler)

		return () => {
			window.removeEventListener("keydown", handler)
		}
	}, [roomRef, room, username, word])

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
					{Object.entries(room.game ?? {})
						.filter(entry => entry[0] !== username)
						.map(([username, data]) => {
							const word = room.words[Object.keys(data).length - 1]!
							const guesses = [
								...data[word]!,
								...Array.from<null>(Array(30 - data[word]!.length)).fill(null)
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
							const guesses = room.game[username]![word]!.slice(i * 5, i * 5 + 5)
							if (row && row.length === 5 && guesses.length === 5) {
								return guesses.map((guess, i) => (
									<LetterSquare
										key={i}
										guess={guess}
										letter={row[i]!}
										isSmall={false}
									/>
								))
							} else if (row && row.length > 0) {
								return Array.from(Array(5)).map((_, i) => (
									<LetterSquare
										key={i}
										guess={null}
										letter={row[i] ?? ""}
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
