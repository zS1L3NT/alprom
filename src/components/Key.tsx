import { FC, PropsWithChildren, useLayoutEffect, useState } from "react"

import { Button } from "@chakra-ui/react"

import { Guess } from "../models/Room"

const Key: FC<
	PropsWithChildren<{
		letter: string
		guess: Guess | null
	}>
> = props => {
	const { letter, guess } = props

	const [color, setColor] = useState("hsl(200, 1%, 51%)")

	useLayoutEffect(() => {
		switch (guess) {
			case null:
				setColor("hsl(200, 1%, 51%)")
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
		<Button
			w="40px"
			h="60px"
			borderRadius={2}
			border="1px"
			borderColor="transparent"
			bg={color}
			color="white">
			{letter}
		</Button>
	)
}

export default Key
