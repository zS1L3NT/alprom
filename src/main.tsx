import App from "./App"
import React from "react"
import ReactDOM from "react-dom"
import store from "./app/store"
import { background, ChakraProvider, extendTheme } from "@chakra-ui/react"
import { BrowserRouter } from "react-router-dom"
import { Provider as ReduxProvider } from "react-redux"
import "./index.css"

const theme = extendTheme({
	colors: {
		correct: "hsl(115, 29%, 43%)",
		present: "hsl(49, 51%, 47%)",
		absent: "hsl(240, 2%, 23%)",
	},
	fonts: {
		heading: "Outfit, sans-serif",
		body: "Outfit, sans-serif",
	},
	styles: {
		global: {
			"html, body": {
				color: "hsl(0, 0%, 95%)",
				bg: "hsl(240, 3%, 7%)",
			},
		},
	},
	components: {
		Button: {
			baseStyle: {
				_focus: {
					boxShadow: "none",
				},
			},
		},
	},
})

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<ReduxProvider store={store}>
				<ChakraProvider theme={theme}>
					<App />
				</ChakraProvider>
			</ReduxProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root"),
)
