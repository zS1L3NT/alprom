import { doc, getDocs, limit, query, setDoc, updateDoc, where } from "firebase/firestore"
import { FC, PropsWithChildren, useState } from "react"
import { CgEnter } from "react-icons/cg"
import { useNavigate } from "react-router-dom"

import {
	Button, Center, Divider, FormControl, FormLabel, HStack, IconButton, Input, InputGroup,
	InputRightElement, Text, useToast
} from "@chakra-ui/react"

import { roomsColl } from "../firebase"
import { iRoom } from "../models/Room"

const _Home: FC<PropsWithChildren<{}>> = () => {
	const navigate = useNavigate()
	const toast = useToast()

	const [username, setUsername] = useState("")
	const [code, setCode] = useState("")

	const createRoom = async () => {
		try {
			const room: iRoom = {
				id: doc(roomsColl).id,
				code: `${Math.floor(Math.random() * (99999 - 10000)) + 10000}`,
				owner: username,
				words: [],
				startedAt: null,
				game: {
					[username]: {}
				}
			}

			await setDoc(doc(roomsColl, room.id), room)
			navigate("/lobby", {
				state: {
					roomId: room.id,
					username
				}
			})
		} catch (e) {
			console.error(e)
		}
	}

	const joinRoom = async () => {
		try {
			const snaps = await getDocs(query(roomsColl, where("code", "==", code), limit(1)))
			const snap = snaps.docs[0]
			const room = snap?.data()

			if (room === null) {
				toast({
					title: "Error",
					description: "Room does not exist",
					status: "error",
					duration: 2500,
					isClosable: true
				})
			} else if (Object.keys(room!.game).includes(username)) {
				toast({
					title: "Error",
					description: "Username not available",
					status: "error",
					duration: 2500,
					isClosable: true
				})
			} else {
				await updateDoc(snap!.ref, `game.${username}`, {})
				navigate("/lobby", {
					state: {
						username,
						roomId: snap!.id
					}
				})
			}
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<Center
			display="flex"
			flexDirection="column"
			gap={2.5}>
			<Text
				fontSize="4xl"
				fontWeight="bold">
				Hello! Welcome to alprom
			</Text>
			<Text
				fontSize="2xl"
				fontWeight="medium"
				textDecoration="underline">
				What is alprom?
			</Text>
			<Text
				fontSize="xl"
				maxW="36ch"
				textAlign="center">
				Alprom is a platform where you are able to play Wordle together with your friends
				and find out who is the real Wordle master!
			</Text>
			<br />
			<FormControl
				isRequired
				size="lg"
				w="lg">
				<FormLabel htmlFor="username">Username</FormLabel>
				<Input
					size="lg"
					w="lg"
					variant="filled"
					id="username"
					placeholder="Enter your preferred username"
					onChange={e => setUsername(e.target.value)}
				/>
			</FormControl>
			<FormControl
				size="lg"
				w="lg">
				<FormLabel
					htmlFor="room-id"
					mt="3em"
					size="lg"
					w="lg"
					variant="filled">
					Room Id
				</FormLabel>
				<InputGroup
					size="lg"
					w="lg"
					variant="filled">
					<Input
						type="number"
						placeholder="Enter the room code here to join!"
						onChange={e => setCode(e.target.value)}
					/>
					<InputRightElement>
						<IconButton
							isDisabled={code.length !== 5}
							aria-label="join-room"
							bgColor="correct"
							_hover={{ bgColor: "hsl(115, 29%, 35%)" }}
							_active={{ bgColor: "hsl(115, 29%, 30%)" }}
							onClick={joinRoom}>
							<CgEnter fontSize="1.25em" />
						</IconButton>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<HStack
				w="25%"
				my={5}>
				<Divider />
				<Text
					fontSize="xl"
					fontWeight="medium"
					textAlign="center"
					px={2}>
					OR
				</Text>
				<Divider />
			</HStack>
			<Button
				isDisabled={!!code || !username}
				bgColor="correct"
				onClick={createRoom}
				_hover={{ bgColor: "hsl(115, 29%, 35%)" }}
				_active={{ bgColor: "hsl(115, 29%, 30%)" }}>
				Create a new room
			</Button>
		</Center>
	)
}

export default _Home
