import Game from "./pages/Game"
import Home from "./pages/Home"
import Lobby from "./pages/Lobby"
import Navbar from "./components/Navbar"
import { Route, Routes } from "react-router-dom"

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
