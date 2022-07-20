import axios from "axios"
import { doc, DocumentReference, onSnapshot, updateDoc } from "firebase/firestore"
import { DateTime } from "luxon"
import { FC, PropsWithChildren, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import {
	Box, Center, Fade, Flex, Grid, SimpleGrid, Spinner, Text, useBoolean, useToast
} from "@chakra-ui/react"

import Keyboard from "../components/Keyboard"
import LetterSquare from "../components/LetterSquare"
import { roomsColl } from "../firebase"
import getGuesses from "../functions/getGuesses"
import useForceRerender from "../hooks/useForceRerender"
import { iRoom } from "../models/Room"
import words from "../words.json"

const Game: FC<PropsWithChildren<{}>> = props => {
	const forceRerender = useForceRerender()
	const location = useLocation()
	const navigate = useNavigate()
	const toast = useToast()

	const [isLoading, setIsLoading] = useBoolean()
	const [username, setUsername] = useState<string | null>(null)
	const [roomRef, setRoomRef] = useState<DocumentReference<iRoom> | null>(null)
	const [room, setRoom] = useState<iRoom | null>(null)
	const [word, setWord] = useState<string | null>(null)
	const [letterChunks, setLetterChunks] = useState<string[][]>([[]])
	const [endTime, setEndTime] = useState<DateTime | null>(null)

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
				navigate("/")
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
		if (roomRef === null || username === null || word === null) return

		return onSnapshot(roomRef, doc => {
			if (doc.exists()) {
				const room = doc.data()

				if (username in room.game) {
					const answered = Object.keys(room.game[username]!).length - 1
					const word = room.words[answered]!

					setRoom(room)
					setWord(word)
					setEndTime(
						endTime =>
							endTime ??
							DateTime.fromJSDate(room.startedAt!.toDate()).plus({
								minutes: 1,
								seconds: 15 * answered
							})
					)

					const letters = room.game[username]![word]!
					const letterChunks = []

					for (let i = 0; i < letters.length; i += 5) {
						letterChunks.push(letters.slice(i, i + 5))
					}

					if (letterChunks.length < 6) {
						letterChunks.push([])
					}

					setLetterChunks(letterChunks)
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
	}, [roomRef, username, word])

	useEffect(() => {
		const handler = async (e: KeyboardEvent) => {
			handleKey(e.key.toUpperCase())
		}

		window.addEventListener("keydown", handler)

		return () => {
			window.removeEventListener("keydown", handler)
		}
	}, [roomRef, room, username, word])

	useEffect(() => {
		if (!endTime) return

		const interval = setInterval(() => {
			if (endTime.diffNow().milliseconds < 1000) {
				console.log("done");
			} else {
				forceRerender()
			}
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [endTime])

	const handleKey = (key: string) => {
		if (roomRef === null || room === null || username === null || word === null) return

		switch (key) {
			case "BACKSPACE":
				toast.close("invalid-word-toast")
				setLetterChunks(letters => {
					if (letters.length === 0) return [[]]

					const row = letters.at(-1)!
					if (row.length === 1) return [...letters.slice(0, -1), []]

					return [...letters.slice(0, -1), row.slice(0, -1)]
				})
				break
			case "ENTER":
				setLetterChunks(letters => {
					if (letters.at(-1)!.length === 5) {
						if (!words.includes(letters.at(-1)!.join(""))) {
							toast.close("invalid-word-toast")
							setTimeout(() => {
								toast({
									id: "invalid-word-toast",
									title: "Invalid Word",
									description: "The word you entered doesn't exist!",
									position: "top-right",
									status: "error",
									isClosable: true
								})
							}, 0)
							return letters
						} else {
							toast.close("invalid-word-toast")
						}

						updateDoc(roomRef, `game.${username}.${word}`, [
							...room!.game[username]![word]!,
							...letters.at(-1)!
						])
						if (letters.length < 6) {
							return [...letters, []]
						} else {
							setIsLoading.on()
							axios
								.post("http://alprom.zectan.com/api/next-round", {
									code: room!.code,
									username
								})
								.finally(setIsLoading.off)
							return letters
						}
					} else {
						return letters
					}
				})
				break
			default:
				toast.close("invalid-word-toast")
				if (alphabet.includes(key)) {
					setLetterChunks(letters => {
						if (letters.length === 1) {
							if (letters[0]!.length === 0) return [[key]]
							if (letters[0]!.length === 5) return letters
							return [[...letters[0]!, key]]
						}

						if (letters.at(-1)!.length === 5) return letters

						return [...letters.slice(0, -1), [...letters.at(-1)!, key]]
					})
				}
				break
		}
	}

	if (username === null || room === null || word === null || endTime === null) {
		return <Spinner />
	}

	return (
		<>
			<Text
				textAlign="center"
				fontSize={48}
				fontWeight="bold"
				px={4}
				mb={4}
				mx="auto"
				w="fit-content"
				borderWidth="1px"
				borderRadius={8}>
				{(((endTime.diffNow().milliseconds / 60000) | 0) + "").padStart(2, "0")}:
				{(((endTime.diffNow().milliseconds / 1000 % 60) | 0) + "").padStart(2, "0")}
			</Text>
			<Flex
				justifyContent="space-evenly"
				alignItems="center">
				<SimpleGrid
					display={Object.keys(room.game).length === 1 ? "none" : "block"}
					w="fit-content"
					columns={2}
					columnGap={4}
					rowGap={8}>
					{Object.entries(room.game ?? {})
						.filter(entry => entry[0] !== username)
						.map(([username, data]) => {
							const word = room.words[Object.keys(data).length - 1]!
							const guesses = getGuesses(word, data[word]!)

							return (
								<Box key={username}>
									<Text
										fontWeight="medium"
										fontSize={20}
										textAlign="center">
										{username}
									</Text>
									<Text
										mb={1}
										fontSize={16}
										color="gray.500"
										textAlign="center">
										Word: #{Object.keys(data).length}
									</Text>
									<Grid
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
								</Box>
							)
						})}
				</SimpleGrid>
				<Flex
					direction="column"
					alignItems="center">
					<Text
						fontWeight="medium"
						fontSize={32}
						textAlign="center">
						{username} (You)
					</Text>
					<Text
						mb={4}
						fontSize={24}
						color="gray.500"
						textAlign="center">
						Word: #{Object.keys(room.game[username]!).length}
					</Text>
					<Grid
						templateColumns="repeat(5, min-content)"
						gap={1.5}
						marginBottom={5}>
						{getGuesses(word, letterChunks.flat()).map((guess, i) => {
							return (
								<LetterSquare
									key={i}
									guess={!!room.game[username]![word]![i] ? guess : null}
									letter={letterChunks[(i / 5) | 0]?.[i % 5] ?? ""}
									isSmall={false}
								/>
							)
						})}
					</Grid>
					<Keyboard
						word={word}
						letters={letterChunks.flat()}
						submittedLetters={room.game[username]![word]!}
						handleKey={handleKey}
					/>
				</Flex>
			</Flex>
			<Fade in={isLoading}>
				<Center
					pos="absolute"
					top={0}
					w={isLoading ? "100%" : 0}
					h={isLoading ? "100%" : 0}
					bg="black"
					opacity="0.5">
					<Spinner />
				</Center>
			</Fade>
		</>
	)
}

export default Game
