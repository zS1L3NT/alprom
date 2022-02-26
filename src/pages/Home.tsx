import { CgEnter } from "react-icons/cg"
import { firestore } from "../firebase"
import { updateRoom } from "../app/slices/room"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
	addDoc,
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore"
import {
	Button,
	Center,
	Divider,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Text,
} from "@chakra-ui/react"

const Home = () => {
	const [username, setUsername] = useState("")
	const [roomId, setRoomId] = useState(0)
	const dispatch = useAppDispatch()

	const navigate = useNavigate()

	useEffect(() => {
		dispatch(updateRoom({ code: roomId, username }))
	}, [username, roomId])

	const createRoom = async () => {
		const roomId = Math.floor(Math.random() * (99999 - 10000)) + 10000
		await addDoc(collection(firestore, "rooms"), {
			owner: username,
			code: roomId,
			words: [],
			scores: {
				[username]: {
					points: 0,
					round: 0,
					guesses: [],
				},
			},
		})
		dispatch(updateRoom({ code: roomId, username }))
		navigate("/lobby")
	}

	const joinRoom = async () => {
		const collRef = collection(firestore, "rooms")
		const docs = await getDocs(query(collRef, where("code", "==", roomId)))
		if (docs.docs.length !== 1) {
			// ! Handle no room found error
		} else if (username in docs.docs[0]!.data().scores) {
			// ! Handle username taken error
		} else {
			const docRef = doc(collRef, docs.docs[0]!.id)
			setDoc(
				docRef,
				{
					scores: {
						[username]: {
							points: 0,
							round: 0,
							guesses: [],
						},
					},
				},
				{ merge: true },
			)
			navigate("/lobby")
		}
	}

	return (
		<Center display="flex" flexDirection="column" gap={2.5}>
			<Text fontSize="4xl" fontWeight="bold">
				Hello! Welcome to alprom
			</Text>
			<Text fontSize="2xl" fontWeight="medium" textDecoration="underline">
				What is alprom?
			</Text>
			<Text fontSize="xl" maxW="36ch" textAlign="center">
				Alprom is a platform where you are able to play Wordle together
				with your friends and find out who is the real Wordle master!
			</Text>
			<br />
			<FormControl isRequired size="lg" w="lg">
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
			<FormControl size="lg" w="lg">
				<FormLabel
					htmlFor="room-id"
					mt="3em"
					size="lg"
					w="lg"
					variant="filled">
					Room Id
				</FormLabel>
				<InputGroup size="lg" w="lg" variant="filled">
					<Input
						type="number"
						placeholder="Enter the room code here to join!"
						onChange={e => setRoomId(+e.target.value)}
					/>
					<InputRightElement>
						<IconButton
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
			<HStack w="25%" my={5}>
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
				bgColor="correct"
				onClick={createRoom}
				_hover={{ bgColor: "hsl(115, 29%, 35%)" }}
				_active={{ bgColor: "hsl(115, 29%, 30%)" }}>
				Create a new room
			</Button>
		</Center>
	)
}

export default Home
