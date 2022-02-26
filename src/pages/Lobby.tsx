import React, { useEffect } from "react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { firestore } from "../firebase"
import { onRoomUpdate } from "../app/slices/room"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { useAppSelector } from "../hooks/useAppSelector"
import { useNavigate } from "react-router-dom"
import {
	Box,
	Button,
	Center,
	IconButton,
	ListItem,
	OrderedList,
	Spacer,
	Text,
	VStack,
} from "@chakra-ui/react"

const Lobby = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const roomId = useAppSelector(state => state.room?.code)

	const users = ["John", "Jane", "Jim", "Jill", "Jack", "Bob", "Bobby", "Eve"]

	useEffect(() => {
		if (!roomId) return

		const unsub = onSnapshot(
			query(collection(firestore, "rooms"), where("code", "==", roomId)),
			doc => {
				if (doc.docs.length === 1) {
					dispatch(onRoomUpdate(doc.docs[0]!.data()))
				}
			},
		)

		return unsub
	}, [roomId])

	return (
		<Center flexDir="column">
			<VStack mb="2em" spacing={0}>
				<Text fontSize="4xl" fontWeight="semibold">
					Room Id
				</Text>
				<Text fontSize="3xl" fontWeight="semibold">
					{roomId}
				</Text>
			</VStack>
			<VStack mb="5em">
				<Text
					textDecoration="underline"
					fontSize="2xl"
					fontWeight="semibold">
					People you are battling against
				</Text>
				<OrderedList>
					{users.map((name, index) => (
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
				onClick={() => navigate("/game")}>
				Start Game
			</Button>
			<Button
				size="md"
				w="xs"
				bgColor="hsl(0, 70%, 53%)"
				_hover={{ bgColor: "hsl(0, 70%, 45%)" }}
				_active={{ bgColor: "hsl(0, 70%, 40%)" }}
				onClick={() => {
					navigate("/")
				}}>
				Close Room
			</Button>
		</Center>
	)
}

export default Lobby
