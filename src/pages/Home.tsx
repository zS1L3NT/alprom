import { CgEnter } from "react-icons/cg"

import {
	Button, Center, Divider, FormControl, FormLabel, HStack, IconButton, Input, InputGroup,
	InputRightElement, Text
} from "@chakra-ui/react"

const Home = () => {
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
						onChange={e => setRoomId(+e.target.value)}
					/>
					<InputRightElement>
						<IconButton
							isDisabled={!roomId || roomId < 10000 || roomId > 99999}
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
				isDisabled={!!roomId}
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
