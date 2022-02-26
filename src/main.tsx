import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { background, ChakraProvider, extendTheme } from "@chakra-ui/react"
import { BrowserRouter } from "react-router-dom"

const theme = extendTheme({
	fonts: {
		heading: "Outfit, sans-serif",
		body: "Outfit, sans-serif",
	},
})

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<ChakraProvider theme={theme}>
				<App />
			</ChakraProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root"),
)
