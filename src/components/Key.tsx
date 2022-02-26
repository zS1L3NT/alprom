import React, { useEffect, useLayoutEffect, useState } from "react"
import { Box, Square, Button } from "@chakra-ui/react"

interface KeyProps {
	letter: string
	state: 0 | 1 | 2 | 3
}

const Key = (props: KeyProps) => {
	const [color, setColor] = useState("hsl(200, 1%, 51%)")

	useLayoutEffect(() => {
		switch (props.state) {
			case 0:
				setColor("hsl(200, 1%, 51%)")
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

	useEffect(() => {
		console.log(color, props)
	}, [color, props])

	return (
		<>
			<Button
				w="40px"
				h="60px"
				borderRadius={2}
				border="1px"
				borderColor="transparent"
				bg={color}
				color="white">
				{props.letter}
			</Button>
		</>
	)
}

export default Key
