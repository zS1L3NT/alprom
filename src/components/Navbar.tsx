import { FC, PropsWithChildren } from "react"
import { useNavigate } from "react-router-dom"

import { Center, Image } from "@chakra-ui/react"

const _Navbar: FC<PropsWithChildren<{}>> = () => {
	const navigate = useNavigate()

	return (
		<Center
			h="6vh"
			mb="2.5vh"
			w="100%"
			bgColor="hsl(240, 3%, 12%)"
			objectFit="contain">
			<Image
				h={8}
				src="./assets/logo.svg"
				transition="all 0.3s ease-out"
				_hover={{ opacity: 0.7, cursor: "pointer" }}
				onClick={() => navigate("/")}
			/>
		</Center>
	)
}

export default _Navbar
