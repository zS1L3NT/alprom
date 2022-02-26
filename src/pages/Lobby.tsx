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
import React from "react"
import { useNavigate } from "react-router-dom"

const Lobby = () => {
	const navigate = useNavigate()

	const users = ["John", "Jane", "Jim", "Jill", "Jack", "Bob", "Bobby", "Eve"]

	return (
		<Center flexDir="column">
			<VStack mb="5em">
				<Text
					textDecoration="underline"
					fontSize="3xl"
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
				Exit Room
			</Button>
		</Center>
	)
}

export default Lobby
