import React from "react"
import LetterBox from "../components/LetterBox"
import Keyboard from "../components/Keyboard"
import { Box, Center, Grid, SimpleGrid, VStack, Stack } from "@chakra-ui/react"

const Game = () => {
	const testArray = Array(30).fill(0)

	const wordArray = ["B", "A", "L", "L", "S", "T", "E", "S", "T", "S"]
	
	const dummyData: any = {
        putt: {
            points: 0,
            round: 0,
            guesses: [
                0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
        },
        joey: {
            points: 0,
            round: 0,
            guesses: [
                0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
        },
        zec: {
            points: 0,
            round: 0,
            guesses: [
                0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
        },
        nitish: {
            points: 0,
            round: 0,
            guesses: [
                0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
        },


    }


	return (
		<>
			<Center>
				<SimpleGrid columns={2}  >

				{/* left side players */}
				<SimpleGrid columns={2} columnGap={4} rowGap={8} paddingRight={8}>
					{
						Object.keys(dummyData).map((key, index) => {
							const guesses = dummyData[key].guesses
							return <Grid templateColumns="repeat(5, min-content)" gap={1.5}>
							{Array(30)
								.fill(0)
								.map((_, i) => (
									<LetterBox
										key={i}
										state={guesses[i]}
										letter={wordArray[i]}
										isSmall={true}
									/>
								))}
						</Grid>
						})
					}


			</SimpleGrid>
			
				</SimpleGrid>

			{/* main grid and keyboard */}
			<Center
				flexDirection="column"
				h="90vh"
				>
				<Grid templateColumns="repeat(5, min-content)" gap={1.5} marginBottom={10}>
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
				<Keyboard />
			</Center>	

			</Center>

		</>
	)
}

export default Game
