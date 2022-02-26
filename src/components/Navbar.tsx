import { Box, Center, Icon, Image } from "@chakra-ui/react"
import React from "react"

const Navbar = () => {
	return (
		<Center h="6vh" mb="2.5vh" w="100%" bgColor="hsl(240, 3%, 12%)" objectFit="contain">
			<Image h={8} src="./assets/Alprom-logo.svg" />
		</Center>
	)
}

export default Navbar
