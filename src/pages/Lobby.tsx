import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { useToast } from "@chakra-ui/react"

import { roomsColl } from "../firebase"
import { iRoom } from "../models/Room"

const Lobby = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const toast = useToast()

	const [room, setRoom] = useState<iRoom | null>(null)

	useEffect(() => {
		if (room === null) {
			if (!!location.state) {
				setRoom(location.state as iRoom)
			} else {
				navigate("/")
			}
		}
	}, [room, location])

	useEffect(() => {
		if (room === null) return

		return onSnapshot(doc(roomsColl, room.id!), doc => {
			if (doc.exists()) {
				setRoom(doc.data())
			} else {
				navigate("/")
				toast({
					title: "Error",
					description: "Room closed!!",
					status: "error",
					duration: 2500
				})
			}
		})
	}, [room])

	return (
		<></>
		// <Center flexDir="column">
		// 	<VStack
		// 		mb="2em"
		// 		spacing={0}>
		// 		<Text
		// 			fontSize="4xl"
		// 			fontWeight="semibold">
		// 			Room Id
		// 		</Text>
		// 		<Skeleton isLoaded={!!room?.code}>
		// 			<Text
		// 				fontSize="3xl"
		// 				fontWeight="semibold">
		// 				{room ? room.code : "000000"}
		// 			</Text>
		// 		</Skeleton>
		// 	</VStack>
		// 	<VStack mb="5em">
		// 		<Text
		// 			textDecoration="underline"
		// 			fontSize="2xl"
		// 			fontWeight="semibold">
		// 			People in this lobby
		// 		</Text>
		// 		<OrderedList>
		// 			{Object.keys(room?.scores || {}).map((name, index) => (
		// 				<ListItem
		// 					key={index}
		// 					fontSize="xl"
		// 					_hover={{
		// 						textDecoration: "line-through",
		// 						textDecorationThickness: "3px",
		// 						cursor: "pointer"
		// 					}}>
		// 					{name}
		// 				</ListItem>
		// 			))}
		// 		</OrderedList>
		// 	</VStack>
		// 	<Tooltip
		// 		label="Only the room owner can start the game"
		// 		shouldWrapChildren
		// 		mb={2}
		// 		placement="top"
		// 		isDisabled={room?.owner === room?.username}>
		// 		<Button
		// 			size="lg"
		// 			w="lg"
		// 			mb={5}
		// 			isDisabled={room?.owner !== room?.username}
		// 			bgColor="correct"
		// 			_hover={{ bgColor: "hsl(115, 29%, 35%)" }}
		// 			_active={{ bgColor: "hsl(115, 29%, 30%)" }}
		// 			onClick={startGame}>
		// 			Start Game
		// 		</Button>
		// 	</Tooltip>
		// 	<Button
		// 		size="md"
		// 		w="xs"
		// 		bgColor="hsl(0, 70%, 53%)"
		// 		_hover={{ bgColor: "hsl(0, 70%, 45%)" }}
		// 		_active={{ bgColor: "hsl(0, 70%, 40%)" }}
		// 		onClick={room?.owner === room?.username ? closeRoom : leaveRoom}>
		// 		{room?.owner === room?.username ? "Close room" : "Leave room"}
		// 	</Button>
		// </Center>
	)
}

export default Lobby
