import { Center, Grid, SimpleGrid } from "@chakra-ui/react"
import React from "react"
import LetterBox from "../components/LetterBox"

const Game = () => {
	const testArray = Array(30).fill(0)

	const wordArray = ["B", "A", "L", "L", "S", "T", "E", "S", "T", "S"]

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
								letter={wordArray[i]}
							/>
						))}
				</Grid>
			</Center>
		</>
	)
}

export default Game
