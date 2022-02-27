import { Square, Text } from "@chakra-ui/react"
import { useLayoutEffect, useState } from "react"

interface LetterBoxProps {
	state: number
	letter?: string
	isSmall?: boolean
}

const LetterBox = (props: LetterBoxProps) => {
	const [color, setColor] = useState("transparent")

	useLayoutEffect(() => {
		switch (props.state) {
			case 0:
				setColor("transparent")
				break
			case 1:
				setColor("absent")
				break
			case 2:
				setColor("present")
				break
			case 3:
				setColor("correct")
				break
		}
	}, [props.state])

	return (
		<Square
			size={props.isSmall ? "1.5em" : "4.5em"}
			border={props.state === 0 ? "2px solid hsl(240, 2%, 23%)" : "none"}
			bg={color}>
			<Text fontWeight="semibold" fontSize={"2.5em"}>
				{props.isSmall ? "" : props.letter}
			</Text>
		</Square>
	)
}

export default LetterBox
