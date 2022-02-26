import getNextRound from "../functions/getNextRound"
import React, { useEffect } from "react"
import { firestore } from "../firebase"
import { onRoomUpdate } from "../app/slices/room"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { useAppSelector } from "../hooks/useAppSelector"
import { useNavigate } from "react-router-dom"
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	onSnapshot,
	query,
	where,
} from "firebase/firestore"
import {
	Button,
	Center,
	ListItem,
	OrderedList,
	Skeleton,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react"

const Lobby = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const toast = useToast()

	const room = useAppSelector(state => state.room)

	useEffect(() => {
		if (!room) return

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
		if (!room) return

		if (room.scores[room.username]?.round === 1) {
			navigate("/game")
		}
	}, [room?.scores])

	const startGame = async () => {
		if (!room) return

		const { word } = await getNextRound({
			code: room.code,
			username: room.username,
		})

		// : Wait for Joey and Putt
	}

	const closeRoom = async () => {
		if (!room) return

		const collRef = collection(firestore, "rooms")
		const docs = await getDocs(
			query(collRef, where("code", "==", room.code)),
		)
		if (docs.docs.length !== 1) {
			toast({
				title: "Error",
				description: "Could not find the room you were looking for",
				status: "error",
				duration: 5000,
				isClosable: true,
			})
		}

		await deleteDoc(doc(collRef, docs.docs[0].id))
		navigate("/")
	}

	return (
		<Center flexDir="column">
			<VStack mb="2em" spacing={0}>
				<Text fontSize="4xl" fontWeight="semibold">
					Room Id
				</Text>
				<Skeleton isLoaded={!!room?.code}>
					<Text fontSize="3xl" fontWeight="semibold">
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
					{Object.keys(room?.scores || {}).map((name, index) => (
						<ListItem
							key={index}
							fontSize="xl"
							_hover={{
								textDecoration: "line-through",
								textDecorationThickness: "3px",
								cursor: "pointer",
							}}>
							{name}
						</ListItem>
					))}
				</OrderedList>
			</VStack>
			<Button
				size="lg"
				w="lg"
				mb={5}
				bgColor="correct"
				_hover={{ bgColor: "hsl(115, 29%, 35%)" }}
				_active={{ bgColor: "hsl(115, 29%, 30%)" }}
				onClick={startGame}>
				Start Game
			</Button>
			<Button
				size="md"
				w="xs"
				bgColor="hsl(0, 70%, 53%)"
				_hover={{ bgColor: "hsl(0, 70%, 45%)" }}
				_active={{ bgColor: "hsl(0, 70%, 40%)" }}
				onClick={closeRoom}>
				Close Room
			</Button>
		</Center>
	)
}

export default Lobby
