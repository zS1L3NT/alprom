import { FC, PropsWithChildren, useLayoutEffect, useState } from "react"

import { Square, Text } from "@chakra-ui/react"

import { Guess } from "../models/Room"

const LetterSquare: FC<
	PropsWithChildren<{
		guess: Guess | null
		letter: string
		isSmall: boolean
	}>
> = props => {
	const { guess, letter, isSmall } = props

	const [color, setColor] = useState("transparent")

	useLayoutEffect(() => {
		switch (guess) {
			case null:
				setColor("transparent")
				break
			case Guess.Incorrect:
				setColor("absent")
				break
			case Guess.Partial:
				setColor("present")
				break
			case Guess.Correct:
				setColor("correct")
				break
		}
	}, [guess])

	return (
		<Square
			size={isSmall ? "1.5em" : "4.5em"}
			border={guess === null ? "2px solid hsl(240, 2%, 23%)" : "none"}
			bg={color}>
			<Text
				fontWeight="semibold"
				fontSize="2.5em">
				{isSmall ? "" : letter}
			</Text>
		</Square>
	)
}

export default LetterSquare
