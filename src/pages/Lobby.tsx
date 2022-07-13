import {
	Button, Center, ListItem, OrderedList, Skeleton, Text, Tooltip, VStack
} from "@chakra-ui/react"

const Lobby = () => {
	return (
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
					{Object.keys(room?.scores || {}).map((name, index) => (
						<ListItem
							key={index}
							fontSize="xl"
							_hover={{
								textDecoration: "line-through",
								textDecorationThickness: "3px",
								cursor: "pointer"
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
				isDisabled={room?.owner === room?.username}>
				<Button
					size="lg"
					w="lg"
					mb={5}
					isDisabled={room?.owner !== room?.username}
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
				onClick={room?.owner === room?.username ? closeRoom : leaveRoom}>
				{room?.owner === room?.username ? "Close room" : "Leave room"}
			</Button>
		</Center>
	)
}

export default Lobby
