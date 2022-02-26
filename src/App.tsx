import React from "react"
import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Game from "./pages/Game"
import Lobby from "./pages/Lobby"
import Home from "./pages/Home"

const App = () => {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/lobby" element={<Lobby />} />
				<Route path="/game" element={<Game />} />
				<Route path="*" element={<Home />} />
			</Routes>
		</>
	)
}

export default App
