import { Center, Grid, SimpleGrid } from "@chakra-ui/react"

import Keyboard from "../components/Keyboard"
import LetterBox from "../components/LetterBox"

const Game = () => {
	return (
		<Center>
			<SimpleGrid columns={2}>
				{/* left side players */}
				<SimpleGrid
					columns={2}
					columnGap={4}
					rowGap={8}
					paddingRight={8}>
					{/* map player scores dictionary to 6x6 grid */}
					{Object.keys(room.scores || {}).map((key, index) => {
						// get each player's guesses
						var guessesArr = room.scores![key].guesses
						return (
							<Grid
								key={index}
								templateColumns="repeat(5, min-content)"
								gap={1.5}>
								{Array(30)
									.fill(0)
									.map((_, i) =>
										guessesArr == undefined ? (
											<></>
										) : (
											<LetterBox
												key={`${index}-${i}`}
												state={guessesArr[i]}
												isSmall={true}
											/>
										)
									)}
							</Grid>
						)
					})}
				</SimpleGrid>
			</SimpleGrid>

			{/* main grid and keyboard */}
			<Center
				flexDirection="column"
				h="90vh">
				<Grid
					templateColumns="repeat(5, min-content)"
					gap={1.5}
					marginBottom={5}>
					{wordArrays.data.flat().map((letter, index) => (
						<LetterBox
							key={index}
							state={letter.state}
							letter={letter.letter}
						/>
					))}
				</Grid>
				<Keyboard />
			</Center>
		</Center>
	)
}

export default Game
