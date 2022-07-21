import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import { ChakraProvider, extendTheme } from "@chakra-ui/react"

import App from "./App"

const theme = extendTheme({
	initialColorMode: "dark",
	useSystemColorMode: false,
	colors: {
		correct: "hsl(115, 29%, 43%)",
		present: "hsl(49, 51%, 47%)",
		absent: "hsl(240, 2%, 23%)"
	},
	fonts: {
		heading: "Outfit, sans-serif",
		body: "Outfit, sans-serif"
	},
	styles: {
		global: {
			"html, body": {
				color: "hsl(0, 0%, 95%)",
				bg: "hsl(240, 3%, 7%)"
			}
		}
	},
	components: {
		Button: {
			baseStyle: {
				_focus: {
					boxShadow: "none"
				}
			}
		}
	}
})

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<ChakraProvider theme={theme}>
			<App />
		</ChakraProvider>
	</BrowserRouter>
)
