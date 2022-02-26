import React from "react"
import LetterBox from "../components/LetterBox"
import Keyboard from "../components/Keyboard"
import { Box, Center, Grid, SimpleGrid, VStack } from "@chakra-ui/react"

const Game = () => {
	const testArray = Array(30).fill(0)

	const wordArray = [
		["B", "A", "L", "L", "S"],
		["T", "E", "S", "T", "S"],
	]

	return (
		<>
			<Box
				h="6vh"
				mb="2.5vh"
				w="100%"
				borderWidth="1px"
				borderColor="white">
				Game
			</Box>

			<Center
				flexDirection="column"
				h="90vh"
				justifyContent="space-between">
				<Grid templateColumns="repeat(5, min-content)" gap={1.5}>
					{Array(30)
						.fill(0)
						.map((_, i) => (
							<LetterBox
								key={i}
								state={testArray[i]}
								letter={wordArray[Math.floor(i / 5)]?.[i % 5]}
							/>
						))}
				</Grid>
				<Keyboard />
			</Center>
		</>
	)
}

export default Game
