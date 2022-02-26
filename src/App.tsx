import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Game from './pages/Game'
import Lobby from './pages/Lobby'

const App = () => {
  return (
	<>
		<div>App</div>
		
		<Routes>
		  <Route path="/" element={<Lobby />} />
		  <Route path="/game" element={<Game />} />
		</Routes>
	</>
  )
}

export default App