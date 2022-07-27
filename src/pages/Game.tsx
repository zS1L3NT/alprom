import axios from "axios"
import { deleteDoc, doc, DocumentReference, onSnapshot, updateDoc } from "firebase/firestore"
import { DateTime } from "luxon"
import { FC, PropsWithChildren, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import {
	Badge, Box, Button, Center, chakra, Container, Divider, Fade, Flex, Grid, SimpleGrid, Spinner,
	Text, useBoolean, useToast
} from "@chakra-ui/react"

import Keyboard from "../components/Keyboard"
import LetterSquare from "../components/LetterSquare"
import { validWords } from "../data"
import { roomsColl } from "../firebase"
import getGuesses from "../functions/getGuesses"
import nextWord from "../functions/nextWord"
import useForceRerender from "../hooks/useForceRerender"
import { Guess, iRoom } from "../models/Room"

const INITIAL_SECONDS = 180
const INCREMENT_SECONDS = 30

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
	const [definitions, setDefinitions] = useState<Record<string, Record<string, string>>>({})

	const alphabet = Array.from(Array(26)).map((_, i) => String.fromCharCode(i + 65))

	// Load the data from the navigation state
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

	// Create listener to the roomRef
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
								minutes: INITIAL_SECONDS / 60,
								seconds: INCREMENT_SECONDS * answered
							})
					)

					const letters = room.game[username]![word]!
					const newLetterChunks: string[][] = []

					for (let i = 0; i < letters.length; i += 5) {
						newLetterChunks.push(letters.slice(i, i + 5))
					}

					if (newLetterChunks.length < 6) {
						newLetterChunks.push([])
					}

					setLetterChunks(letterChunks => {
						return newLetterChunks.map((newLetterChunk, i) =>
							newLetterChunk.length === 0 ? letterChunks[i] ?? [] : newLetterChunk
						)
					})
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

	// Empty the letters after the word changes
	useEffect(() => {
		setLetterChunks([[]])
	}, [word])

	// Listen to keypresses
	useEffect(() => {
		const handler = async (e: KeyboardEvent) => {
			handleKey(e.key.toUpperCase())
		}

		window.addEventListener("keydown", handler)

		return () => {
			window.removeEventListener("keydown", handler)
		}
	}, [roomRef, room, username, word])

	// Fetch the dictionary data of each word
	useEffect(() => {
		if (!room?.words) return

		setDefinitions(definitions => {
			const words = room.words.filter(word => !(word in definitions))

			for (const word of words) {
				axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`).then(res => {
					setDefinitions(definitions => ({
						...definitions,
						[word]: res.data[0].meanings.reduce(
							(acc: Record<string, string>, meaning: any) => ({
								...acc,
								[meaning.partOfSpeech]: meaning.definitions[0].definition
							}),
							{}
						)
					}))
				})
			}

			return {
				...definitions,
				...words.reduce((words, word) => ({ ...words, [word]: null }), {})
			}
		})
	}, [room?.words])

	// Rerender the widget every second to make the clock update
	useEffect(() => {
		const interval = setInterval(forceRerender, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [])

	const handleKey = (key: string) => {
		if (
			roomRef === null ||
			room === null ||
			username === null ||
			word === null ||
			endTime === null ||
			endTime.diffNow().milliseconds < 0
		) {
			return
		}

		switch (key) {
			case "BACKSPACE":
				toast.close("invalid-word-toast")
				setLetterChunks(letterChunks => {
					if (letterChunks.length === 0) return [[]]

					const row = letterChunks.at(-1)!
					if (row.length === 1) return [...letterChunks.slice(0, -1), []]

					return [...letterChunks.slice(0, -1), row.slice(0, -1)]
				})
				break
			case "ENTER":
				setLetterChunks(letterChunks => {
					if (letterChunks.at(-1)!.length === 5) {
						if (!validWords.includes(letterChunks.at(-1)!.join("").toLowerCase())) {
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
							return letterChunks
						} else {
							toast.close("invalid-word-toast")
						}

						updateDoc(roomRef, `game.${username}.${word}`, [
							...room!.game[username]![word]!,
							...letterChunks.at(-1)!
						])

						const correct = getGuesses(word, letterChunks.flat())
							.filter(guess => guess !== null)
							.slice(-5)
							.every(guess => guess === Guess.Correct)

						if (letterChunks.length === 6 || correct) {
							setEndTime(endTime => endTime!.plus({ seconds: correct ? INCREMENT_SECONDS : 0 }))
							setIsLoading.on()
							nextWord(roomRef, room, username).finally(setIsLoading.off)
							return letterChunks
						} else {
							return [...letterChunks, []]
						}
					} else {
						return letterChunks
					}
				})
				break
			default:
				toast.close("invalid-word-toast")
				if (alphabet.includes(key)) {
					setLetterChunks(letterChunks => {
						if (letterChunks.length === 1) {
							if (letterChunks[0]!.length === 0) return [[key]]
							if (letterChunks[0]!.length === 5) return letterChunks
							return [[...letterChunks[0]!, key]]
						}

						if (letterChunks.at(-1)!.length === 5) return letterChunks

						return [...letterChunks.slice(0, -1), [...letterChunks.at(-1)!, key]]
					})
				}
				break
		}
	}

	const leaveGame = async () => {
		navigate("/")
	}

	const closeGame = async () => {
		if (roomRef === null) return

		try {
			await deleteDoc(roomRef)
		} catch (e) {
			console.error(e)
		}
	}

	if (username === null || room === null || word === null || endTime === null) {
		return (
			<Center>
				<Spinner />
			</Center>
		)
	}

	return endTime.diffNow().milliseconds < 0 ? (
		<Center flexDirection="column">
			<Container
				p={6}
				bg="hsl(240, 3%, 12%)"
				rounded="lg">
				<Text
					fontSize={36}
					fontWeight="bold">
					Results
				</Text>
				<Divider my={4} />
				{Object.entries(room.game)
					.map<[string, number]>(([username, data]) => [
						username,
						Object.entries(data)
							.map(([word, letters]) => letters.slice(-5).join("") === word)
							.filter(res => !!res).length
					])
					.map<[string, number, number]>(([username, score]) => [
						username,
						INITIAL_SECONDS * 1000 +
							INCREMENT_SECONDS * 1000 * score -
							DateTime.now().diff(DateTime.fromJSDate(room.startedAt!.toDate()))
								.milliseconds,
						score
					])
					.sort((a, b) => {
						if (a[2] > b[2]) return -1
						if (b[2] > a[2]) return 1
						if (a[1] > b[1]) return -1
						if (b[1] > a[1]) return 1

						return a[0].localeCompare(b[0])
					})
					.map(([username_, milliseconds, score], i) => (
						<Text
							key={username_}
							display="flex"
							fontSize={20}>
							<chakra.b mr={1}>{i + 1}.</chakra.b>
							{username_}
							{username_ === username ? (
								<Badge
									mx={1}
									my="auto">
									{" "}
									(You)
								</Badge>
							) : (
								<></>
							)}
							{" - "}
							<chakra.i ml={1}>{score}</chakra.i>
							<Badge
								colorScheme={milliseconds > 0 ? "green" : "red"}
								h="fit-content"
								mx={2}
								my="auto">
								{milliseconds > 0
									? (((milliseconds / 60000) | 0) + "").padStart(2, "0") +
									  ":" +
									  (((milliseconds / 1000) % 60 | 0) + "").padStart(2, "0")
									: "Times Up"}
							</Badge>
						</Text>
					))}
			</Container>
			<Button
				size="md"
				w="xs"
				mt={4}
				bgColor="hsl(0, 70%, 53%)"
				_hover={{ bgColor: "hsl(0, 70%, 45%)" }}
				_active={{ bgColor: "hsl(0, 70%, 40%)" }}
				onClick={room.owner === username ? closeGame : leaveGame}>
				{room.owner === username ? "Close game" : "Leave game"}
			</Button>
			<Box
				mt={4}
				w="250px">
				<Text>Previous word:</Text>
				<Text
					fontSize={24}
					fontWeight="bold">
					{room.words[Object.keys(room.game[username]!).length - 1]}
				</Text>
				{Object.entries(
					definitions[room.words[Object.keys(room.game[username]!).length - 1]!]!
				).map(([partOfSentence, meaning]) => (
					<Box mt={2}>
						<Text>
							<i>{partOfSentence}:</i>
						</Text>
						<Text ml={6}>{meaning}</Text>
					</Box>
				))}
			</Box>
		</Center>
	) : (
		<>
			<Flex
				justifyContent="space-evenly"
				alignItems="center">
				<Flex direction="column">
					<Text
						textAlign="center"
						fontSize={48}
						fontWeight="bold"
						px={4}
						mb={4}
						mx="auto"
						w="180px"
						borderWidth="1px"
						borderRadius={8}>
						{(((endTime.diffNow().milliseconds / 60000) | 0) + "").padStart(2, "0")}:
						{(((endTime.diffNow().milliseconds / 1000) % 60 | 0) + "").padStart(2, "0")}
					</Text>
					<SimpleGrid
						w="fit-content"
						columns={2}
						columnGap={4}
						rowGap={8}>
						{Object.entries(room.game)
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
				</Flex>
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
				<Box w="250px">
					<Text>Previous word:</Text>
					<Text
						fontSize={24}
						fontWeight="bold">
						{room.words[Object.keys(room.game[username]!).length - 2] ?? "no word"}
					</Text>
					{Object.entries(
						definitions[
							room.words[Object.keys(room.game[username]!).length - 2] ?? ""
						] ?? {}
					).map(([partOfSentence, meaning]) => (
						<Box mt={2}>
							<Text>
								<i>{partOfSentence}:</i>
							</Text>
							<Text ml={6}>{meaning}</Text>
						</Box>
					))}
				</Box>
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
