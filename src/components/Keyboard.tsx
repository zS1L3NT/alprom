import React, { useState } from "react"
import {
	Button,
	Square,
	HStack,
	Box,
	VStack,
	Icon,
	Center,
} from "@chakra-ui/react"
import { FaBackspace } from "react-icons/fa"

import Key from "./Key"

type KeysData = { letter: string; state: 0 | 1 | 2 | 3 }[]

const Keyboard = () => {
	const [asd, setAsd] = useState<0 | 1 | 2 | 3>(0)
	const keysmap = [
		{ letter: "Q", state: 0 },
		{ letter: "W", state: 0 },
		{ letter: "E", state: 0 },
		{ letter: "R", state: 0 },
		{ letter: "T", state: 0 },
		{ letter: "Y", state: 0 },
		{ letter: "U", state: 0 },
		{ letter: "I", state: 0 },
		{ letter: "O", state: 0 },
		{ letter: "P", state: 0 },
		{ letter: "A", state: 0 },
		{ letter: "S", state: 0 },
		{ letter: "D", state: 0 },
		{ letter: "F", state: 0 },
		{ letter: "G", state: 0 },
		{ letter: "H", state: 0 },
		{ letter: "J", state: 0 },
		{ letter: "K", state: 0 },
		{ letter: "L", state: 0 },
		{ letter: "Z", state: 0 },
		{ letter: "X", state: 0 },
		{ letter: "C", state: 0 },
		{ letter: "V", state: 0 },
		{ letter: "B", state: 0 },
		{ letter: "N", state: 0 },
		{ letter: "M", state: 0 },
	] as KeysData

	return (
		<>
			<VStack justify="center" spacing={1.5}>
				<HStack spacing={1.5}>
					{keysmap.slice(0, 10).map((key, index) => (
						<Key letter={key.letter} state={key.state} />
					))}
				</HStack>
				<HStack spacing={1.5}>
					{keysmap.slice(10, 19).map((key, index) => (
						<Key letter={key.letter} state={key.state} />
					))}
				</HStack>
				<HStack spacing={1.5}>
					<Button
						h="60px"
						w="60px"
						border="1px"
						borderColor="transparent"
						borderRadius={2}
						bg="hsl(200, 1%, 51%)"
						color="white">
						ENTER
					</Button>
					{keysmap.slice(19, 27).map((key, index) => (
						<Key letter={key.letter} state={key.state} />
					))}
					<Button
						h="60px"
						w="60px"
						border="1px"
						borderColor="transparent"
						borderRadius={2}
						bg="hsl(200, 1%, 51%)"
						color="white">
						<Icon boxSize={6} as={FaBackspace} />
					</Button>
				</HStack>
			</VStack>
		</>
	)
}

export default Keyboard
