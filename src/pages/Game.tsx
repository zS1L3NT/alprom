import React from "react"
import LetterBox from "../components/LetterBox"
import Keyboard from "../components/Keyboard"
import { Center, Grid, SimpleGrid } from "@chakra-ui/react"

const Game = () => {
	const testArray = Array(30).fill(0)

	const wordArray = [
		["B", "A", "L", "L", "S"],
		["T", "E", "S", "T", "S"],
	]

	return (
		<>
			<div>Game</div>

			<Center>
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
			</Center>
			<Keyboard></Keyboard>
		</>
	)
}

export default Game
