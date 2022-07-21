import axios from "axios"
import {
	deleteDoc, deleteField, doc, DocumentReference, onSnapshot, updateDoc
} from "firebase/firestore"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import {
	Button, Center, Fade, ListItem, OrderedList, Skeleton, Spinner, Text, Tooltip, useBoolean,
	useToast, VStack
} from "@chakra-ui/react"

import { roomsColl } from "../firebase"
import { iRoom } from "../models/Room"

const Lobby = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const toast = useToast()

	const [isLoading, setIsLoading] = useBoolean()
	const [username, setUsername] = useState<string | null>(null)
	const [roomRef, setRoomRef] = useState<DocumentReference<iRoom> | null>(null)
	const [room, setRoom] = useState<iRoom | null>(null)

	useEffect(() => {
		if (username === null) {
			const state = location.state as {
				roomId: string
				username: string
			}

			if (state) {
				setRoomRef(doc(roomsColl, state.roomId))
				setUsername(state.username)
			} else {
				navigate("/")
				toast({
					title: "No lobby found",
					description: "Could not re-enter the lobby page",
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
					if (Object.keys(room.game[username]!).length === 1) {
						navigate("/game", {
							state: {
								username,
								roomId: room.id,
								word: room.words.at(-1)
							}
						})
						toast({
							title: "Game started",
							description: `${room.owner} started the game`,
							status: "success",
							duration: 2500
						})
					} else {
						setRoom(doc.data())
					}
				} else {
					navigate("/")
					toast({
						title: "Removed from room",
						description: "Someone removed you from the game room",
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

	const startGame = async () => {
		try {
			setIsLoading.on()
			await axios.post("http://alprom.zectan.com/api/next-round", {
				code: room!.code,
				username: username!
			})
		} catch (e) {
			console.error(e)
		} finally {
			setIsLoading.off()
		}
	}

	const removeFromRoom = async (username: string) => {
		if (roomRef === null) return

		try {
			await updateDoc(roomRef, `game.${username}`, deleteField())
		} catch (e) {
			console.error(e)
		}
	}

	const leaveRoom = async () => {
		if (username !== null) {
			await removeFromRoom(username)
			navigate("/")
		}
	}

	const closeRoom = async () => {
		if (roomRef === null) return

		try {
			await deleteDoc(roomRef)
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<>
			<Center flexDir="column">
				<VStack
					mb="2em"
					spacing={0}>
					<Text
						fontSize="4xl"
						fontWeight="semibold">
						Room Id
					</Text>
					<Skeleton isLoaded={!!room?.code}>
						<Text
							fontSize="3xl"
							fontWeight="semibold">
							{room ? room.code : "000000"}
						</Text>
					</Skeleton>
				</VStack>
				<VStack mb="5em">
					<Text
						textDecoration="underline"
						fontSize="2xl"
						fontWeight="semibold">
						People in this lobby
					</Text>
					<OrderedList>
						{Object.keys(room?.game || {})
							.sort()
							.map((name, index) => (
								<ListItem
									key={index}
									fontSize="xl"
									_hover={
										room?.owner === username && name !== username
											? {
													textDecoration: "line-through",
													textDecorationThickness: "3px",
													cursor: "pointer"
											  }
											: {}
									}
									onClick={() => {
										if (room?.owner === username && name !== username) {
											removeFromRoom(name)
										}
									}}>
									{name}
								</ListItem>
							))}
					</OrderedList>
				</VStack>
				<Tooltip
					label="Only the room owner can start the game"
					shouldWrapChildren
					mb={2}
					placement="top"
					isDisabled={room?.owner === username}>
					<Button
						size="lg"
						w="lg"
						mb={5}
						isDisabled={room?.owner !== username}
						bgColor="correct"
						_hover={{ bgColor: "hsl(115, 29%, 35%)" }}
						_active={{ bgColor: "hsl(115, 29%, 30%)" }}
						onClick={startGame}>
						Start Game
					</Button>
				</Tooltip>
				<Button
					size="md"
					w="xs"
					bgColor="hsl(0, 70%, 53%)"
					_hover={{ bgColor: "hsl(0, 70%, 45%)" }}
					_active={{ bgColor: "hsl(0, 70%, 40%)" }}
					onClick={room?.owner === username ? closeRoom : leaveRoom}>
					{room?.owner === username ? "Close room" : "Leave room"}
				</Button>
			</Center>
			<Fade in={isLoading}>
				<Center
					pos="absolute"
					top={0}
					left={0}
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

export default Lobby
